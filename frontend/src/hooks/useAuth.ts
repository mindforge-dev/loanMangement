import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { login, register, logout as logoutApi } from "../services/authService";
import type {
  LoginCredentials,
  AuthResponse,
  RegisterData,
} from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { hasPermission, isSuperAdmin } from "../lib/permissions";

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  LoginCredentials
> => {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
      window.location.href = "/";
    },
  });
};

export const useRegister = (): UseMutationResult<
  AuthResponse,
  Error,
  RegisterData
> => {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
      window.location.href = "/";
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      await logoutApi(refreshToken);
    },
    onSettled: () => {
      logoutStore();
      window.location.href = "/login";
    },
  });
};

export const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
};

export const useHasPermission = (permission: string): boolean => {
  return useAuthStore((state) => hasPermission(state.user, permission));
};

export const useHasAnyPermission = (permissions: string[]): boolean => {
  return useAuthStore((state) =>
    permissions.length === 0
      ? true
      : isSuperAdmin(state.user) ||
        permissions.some((p) => state.user?.permissions.includes(p)),
  );
};

export const useIsSuperAdmin = (): boolean => {
  return useAuthStore((state) => isSuperAdmin(state.user));
};
