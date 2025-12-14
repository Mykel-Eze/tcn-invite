import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Notification } from '../components/Notification'
import logo from '../assets/images/tcn_icon_white.png'

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [notification, setNotification] = useState(null)
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.error('⏱️ Signup timeout - taking too long')
            setError('Signup is taking too long. Please check your connection and try again.')
            setLoading(false)
        }, 30000) // 30 second timeout

        try {
            console.log('📝 Submitting signup form...')
            const result = await signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: 'inviter', // All signups are members/inviters by default
            })

            clearTimeout(timeoutId) // Clear timeout if signup completes

            console.log('📝 Signup result:', {
                hasData: !!result?.data,
                hasError: !!result?.error,
                requiresEmailConfirmation: result?.requiresEmailConfirmation
            })

            if (result?.error) {
                console.error('📝 Error from signUp:', result.error)
                setError(result.error.message || 'Signup failed. Please try again.')
                setLoading(false)
            } else if (result?.requiresEmailConfirmation) {
                // Email confirmation required
                setError('')
                setLoading(false)
                setNotification({
                    type: 'success',
                    message: 'Account created! Please check your email to confirm your account before signing in.'
                })
                // Navigate after showing notification
                setTimeout(() => navigate('/login'), 3000)
            } else if (result?.data) {
                // Successfully signed up and logged in
                console.log('✓ Signup successful, navigating to dashboard...')
                // Small delay to ensure auth state updates
                await new Promise(resolve => setTimeout(resolve, 500))
                navigate('/')
            } else {
                console.error('📝 Unexpected result:', result)
                setError('Signup failed. Please try again.')
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
            {/* Custom Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

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
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-gray-400 mt-2">Join TCN Invite System</p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer mt-5"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
