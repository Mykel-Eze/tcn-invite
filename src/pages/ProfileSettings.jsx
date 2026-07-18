import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { PasswordInput } from '../components/ui/PasswordInput'
import { Notification } from '../components/Notification'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, KeyRound } from 'lucide-react'

export default function ProfileSettings() {
    const { user, profile, updateProfile, updatePassword } = useAuth()

    const [ fullName, setFullName ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ savingProfile, setSavingProfile ] = useState(false)

    const [ currentPassword, setCurrentPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ savingPassword, setSavingPassword ] = useState(false)

    const [ notification, setNotification ] = useState(null)

    // Pre-fill the form once the profile loads
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '')
            setPhone(profile.phone || '')
        }
    }, [ profile ])

    const notify = (type, message) => setNotification({ type, message })

    const handleProfileSave = async (e) => {
        e.preventDefault()

        if (!fullName.trim()) {
            return notify('error', 'Please enter your full name.')
        }
        if (phone.trim() && !/^\+?[\d\s-]{7,17}$/.test(phone.trim())) {
            return notify('error', 'Please enter a valid phone number (e.g. +2348012345678)')
        }

        setSavingProfile(true)
        const { error } = await updateProfile({
            fullName: fullName.trim(),
            phone: phone.trim(),
        })
        setSavingProfile(false)

        if (error) {
            notify('error', error.message || 'Failed to update profile.')
        } else {
            notify('success', 'Profile updated successfully!')
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            return notify('error', 'New passwords do not match.')
        }
        if (newPassword.length < 8) {
            return notify('error', 'New password must be at least 8 characters.')
        }

        setSavingPassword(true)
        try {
            // Verify the current password before allowing a change
            const { error: verifyError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            })

            if (verifyError) {
                notify('error', 'Current password is incorrect.')
                return
            }

            const { error } = await updatePassword(newPassword)
            if (error) {
                notify('error', error.message || 'Failed to update password.')
            } else {
                notify('success', 'Password updated successfully!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        } finally {
            setSavingPassword(false)
        }
    }

    return (
        <Layout>
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="flex flex-col space-y-6 mt-4">
                <div>
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                    <p className="text-gray-400 text-sm">Manage your account details</p>
                </div>

                {/* Account details */}
                <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <User size={18} className="text-(--color-accent)" />
                        Account Details
                    </div>

                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={profile?.email || user?.email || ''}
                            disabled
                        />
                        <Input
                            label="Full Name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                            required
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+234 801 234 5678"
                        />
                        <Button type="submit" className="w-full cursor-pointer" disabled={savingProfile}>
                            {savingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Card>

                {/* Change password */}
                <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <KeyRound size={18} className="text-(--color-accent)" />
                        Change Password
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                        />
                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            required
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            required
                        />
                        <Button type="submit" className="w-full cursor-pointer" disabled={savingPassword}>
                            {savingPassword ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                </Card>
            </div>
        </Layout>
    )
}
