import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import InvitationFlow from './pages/InvitationFlow'
import PCUCheckIn from './pages/PCUCheckIn'
import InviteDetails from './pages/InviteDetails'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Auth callback routes (for email verification) */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/access_token" element={<AuthCallback />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invite/new"
            element={
              <ProtectedRoute>
                <InvitationFlow />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/pcu-checkin"
            element={
              <ProtectedRoute adminOnly={true}>
                <PCUCheckIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only invite verification */}
          <Route
            path="/verify/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <InviteDetails />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
