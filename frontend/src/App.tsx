import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import { Login, Register } from './pages/auth'
import {
  Dashboard,
  Users,
  Loans,
  Borrowers,
  Payments,
  Reports,
  Settings
} from './pages/dashboard'
import { Permissions } from './lib/permissions'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredPermission={Permissions.DASHBOARD_VIEW}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredPermission={Permissions.USERS_VIEW}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="loans"
            element={
              <ProtectedRoute requiredPermission={Permissions.LOANS_VIEW}>
                <Loans />
              </ProtectedRoute>
            }
          />
          <Route
            path="borrowers"
            element={
              <ProtectedRoute requiredPermission={Permissions.BORROWERS_VIEW}>
                <Borrowers />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments"
            element={
              <ProtectedRoute requiredPermission={Permissions.TRANSACTIONS_VIEW}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
