import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import logo from '../assets/images/tcn_icon_white.png'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.error('⏱️ Login timeout - taking too long')
            setError('Login is taking too long. Please check your connection and try again.')
            setLoading(false)
        }, 30000) // 30 second timeout

        try {
            console.log('🔐 Submitting login form...')
            const { data, error } = await signIn({ email, password })

            clearTimeout(timeoutId) // Clear timeout if login completes

            console.log('🔐 Login result:', {
                hasData: !!data,
                hasError: !!error
            })

            if (error) {
                console.error('🔐 Error from signIn:', error)
                setError(error.message || 'Login failed. Please try again.')
                setLoading(false)
            } else if (data?.session) {
                // Successfully logged in
                console.log('✓ Login successful!')
                console.log('✓ Session:', {
                    hasUser: !!data.user,
                    userId: data.user?.id,
                    hasSession: !!data.session
                })
                console.log('✓ Navigating to dashboard...')

                // Don't set loading to false - let the navigation happen
                // The ProtectedRoute will handle the loading state
                navigate('/')
            } else {
                console.error('🔐 Unexpected result - no session:', { hasData: !!data, hasError: !!error })
                setError('Login failed. Please try again.')
                setLoading(false)
            }
        } catch (err) {
            clearTimeout(timeoutId)
            console.error('❌ Caught error in handleSubmit:', err)
            setError('An unexpected error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212] relative overflow-hidden">
            {/* Background Gradients/Glows - Same as Layout */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-accent) opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-highlight) opacity-10 blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="TCN Logo"
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to continue to TCN Invite</p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer mt-5"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[var(--color-accent)] hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
