import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import { Login, Register } from './pages/auth'
import { Permissions } from './lib/permissions'

const Dashboard = lazy(() => import('./pages/dashboard/home/Dashboard'))
const Users = lazy(() => import('./pages/dashboard/users/Users'))
const Loans = lazy(() => import('./pages/dashboard/loans/Loans'))
const Borrowers = lazy(() => import('./pages/dashboard/borrowers/Borrowers'))
const Payments = lazy(() => import('./pages/dashboard/payments/Payments'))
const Reports = lazy(() => import('./pages/dashboard/reports/Reports'))
const Settings = lazy(() => import('./pages/dashboard/settings/Settings'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      }>
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
