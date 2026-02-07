import { Navigate } from 'react-router'
import { isAuthenticated } from '../services/authService'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
