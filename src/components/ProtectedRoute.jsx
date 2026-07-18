import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function FullScreenSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--color-accent)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="text-white mt-4">Loading...</p>
            </div>
        </div>
    )
}

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, profile, loading, profileLoading } = useAuth()

    // Show loading state while checking authentication
    if (loading) {
        return <FullScreenSpinner />
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // For admin routes, wait until the profile (which carries the role) is loaded
    // so admins don't get flashed an "Access Denied" screen mid-fetch
    if (adminOnly && !profile && profileLoading) {
        return <FullScreenSpinner />
    }

    if (adminOnly && profile?.role !== 'admin' && profile?.role !== 'pcu_host') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="text-center max-w-md px-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">
                        This page is only accessible to administrators and PCU hosts.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        )
    }

    return children
}
