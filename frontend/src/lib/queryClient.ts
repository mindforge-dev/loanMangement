import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't retry on auth/permission errors — refresh/forbidden won't fix on retry
            retry: (failureCount, error) => {
                if (isAxiosError(error)) {
                    const status = error.response?.status
                    if (status === 401 || status === 403) return false
                }
                return failureCount < 1
            },
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})
