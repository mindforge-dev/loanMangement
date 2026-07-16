import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/authStore";
import { refreshAccessToken } from "../services/authService";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Request interceptor - attach the access token if available
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Silent refresh (single-flight) ----
let refreshPromise: Promise<string> | null = null;

function refresh(): Promise<string> {
  // Collapse concurrent 401s into a single refresh request
  if (!refreshPromise) {
    const { refreshToken, setTokens } = useAuthStore.getState();
    refreshPromise = (async () => {
      if (!refreshToken) throw new Error("No refresh token");
      const data = await refreshAccessToken(refreshToken);
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function forceLogout() {
  useAuthStore.getState().logout();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// Response interceptor - silent refresh on 401; leave 403 to the caller
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;
    const status = error.response?.status;

    if (status === 403) {
      return Promise.reject(error);
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || "";
      if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
        forceLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const newAccessToken = await refresh();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    // Repeated 401 even after a retry attempt
    if (status === 401) {
      forceLogout();
    }

    return Promise.reject(error);
  },
);

export default api;
