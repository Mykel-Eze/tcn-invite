import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallback() {
    const [status, setStatus] = useState('loading') // loading, success, error
    const [message, setMessage] = useState('Verifying your email...')
    const navigate = useNavigate()

    useEffect(() => {
        const handleEmailVerification = async () => {
            try {
                console.log('📧 Handling email verification...')

                // Get the hash fragment from the URL
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')
                const type = hashParams.get('type')

                console.log('📧 Hash params:', {
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
                    type
                })

                // Also check URL params (some Supabase versions use this)
                const urlParams = new URLSearchParams(window.location.search)
                const tokenFromParams = urlParams.get('access_token')
                const typeFromParams = urlParams.get('type')

                console.log('📧 URL params:', {
                    hasAccessToken: !!tokenFromParams,
                    type: typeFromParams
                })

                if (accessToken || tokenFromParams) {
                    console.log('✓ Found access token, setting session...')

                    // Set the session with the tokens
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken || tokenFromParams,
                        refresh_token: refreshToken || urlParams.get('refresh_token')
                    })

                    if (error) {
                        console.error('❌ Error setting session:', error)
                        setStatus('error')
                        setMessage(error.message || 'Failed to verify email. Please try again.')
                        return
                    }

                    console.log('✓ Session set successfully:', { hasUser: !!data.user })
                    setStatus('success')
                    setMessage('Email verified successfully! Redirecting to dashboard...')

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                } else {
                    // No token found, might be a different type of callback
                    console.log('⚠️ No access token found in URL')

                    // Check if user is already logged in
                    const { data: { session } } = await supabase.auth.getSession()

                    if (session) {
                        console.log('✓ User already has active session')
                        setStatus('success')
                        setMessage('Already logged in! Redirecting...')
                        setTimeout(() => navigate('/'), 1000)
                    } else {
                        console.error('❌ No token and no session')
                        setStatus('error')
                        setMessage('Invalid verification link. Please try again or request a new verification email.')
                    }
                }
            } catch (err) {
                console.error('❌ Error in email verification:', err)
                setStatus('error')
                setMessage('An unexpected error occurred. Please try logging in.')
            }
        }

        handleEmailVerification()
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212] relative overflow-hidden">
            {/* Background Gradients/Glows - Same as other pages */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent)] opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-highlight)] opacity-10 blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/tcn_logo.png"
                        alt="TCN Logo"
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-white">Email Verification</h1>
                </div>

                {/* Status Card */}
                <div className="bg-[#1A1A1A] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon based on status */}
                        {status === 'loading' && (
                            <Loader2 className="w-16 h-16 text-[var(--color-accent)] animate-spin mb-4" />
                        )}
                        {status === 'success' && (
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        )}
                        {status === 'error' && (
                            <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        )}

                        {/* Message */}
                        <p className={`text-lg ${
                            status === 'loading' ? 'text-gray-300' :
                            status === 'success' ? 'text-green-400' :
                            'text-red-400'
                        }`}>
                            {message}
                        </p>

                        {/* Additional actions for error state */}
                        {status === 'error' && (
                            <div className="mt-6 space-y-3 w-full">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="cursor-pointer w-full px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white rounded-lg transition-colors"
                                >
                                    Go to Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="cursor-pointer w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Create New Account
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
