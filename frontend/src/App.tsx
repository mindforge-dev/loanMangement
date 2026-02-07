import { BrowserRouter, Routes, Route } from 'react-router'
import DashboardLayout from './layouts/DashboardLayout'
import {
  Dashboard,
  Users,
  Loans,
  Payments,
  Reports,
  Settings
} from './pages/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="loans" element={<Loans />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
