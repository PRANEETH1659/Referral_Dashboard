import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ReferralDetailPage from './pages/ReferralDetailPage'
import NotFoundPage from './pages/NotFoundPage'

function ProtectedRoute({children}) {
  const token = Cookies.get('jwt_token')
  return token ? children : <Navigate to="/login" replace />
}

function LoginRoute() {
  const token = Cookies.get('jwt_token')
  return token ? <Navigate to="/" replace /> : <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/referrals"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/referral/:id"
          element={
            <ProtectedRoute>
              <ReferralDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
