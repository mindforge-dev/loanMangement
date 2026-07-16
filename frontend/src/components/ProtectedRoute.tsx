import { Navigate, useLocation } from 'react-router'
import { useAuthStore } from '../stores/authStore'
import { hasPermission } from '../lib/permissions'

interface ProtectedRouteProps {
    children: React.ReactNode
    /** A `module:action` permission required to view this route. Omit for auth-only. */
    requiredPermission?: string
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const location = useLocation()

    if (!isAuthenticated) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredPermission && !hasPermission(user, requiredPermission)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">403 — Access Denied</h1>
                <p className="text-gray-500">
                    You don't have permission to view this page.
                </p>
            </div>
        )
    }

    return <>{children}</>
}
