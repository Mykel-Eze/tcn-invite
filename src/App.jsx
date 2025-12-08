import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InvitationFlow from './pages/InvitationFlow'
import PCUCheckIn from './pages/PCUCheckIn'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invite/new" element={<InvitationFlow />} />
        <Route path="/pcu-checkin" element={<PCUCheckIn />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
