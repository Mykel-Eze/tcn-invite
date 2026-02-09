import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import logo from '../assets/images/tcn_icon_white.png'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
    const [ email, setEmail ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const { resetPasswordForEmail } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)

        const result = await resetPasswordForEmail(email)

        if (result.error) {
            setError(result.error.message || 'Failed to send reset email')
        } else {
            setMessage('Check your inbox for further instructions')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212] relative overflow-hidden">
            {/* Background Gradients/Glows */}
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
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                                {message}
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

                        <Button
                            type="submit"
                            className="w-full cursor-pointer mt-5"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
