import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function InviteDetails() {
    const { id } = useParams() // This matches the QR code value
    const { profile, loading: authLoading } = useAuth()
    const navigate = useNavigate()
    const [ invite, setInvite ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ attendanceConfirmed, setAttendanceConfirmed ] = useState(false)

    useEffect(() => {
        async function fetchInvite() {
            if (!id) return;

            // Wait for auth to load
            if (authLoading) return;

            // Check if user is admin or pcu_host
            if (!profile || (profile.role !== 'admin' && profile.role !== 'pcu_host')) {
                setError("Access denied. Only admins and PCU hosts can verify invitations.")
                setLoading(false)
                return
            }

            setLoading(true)

            // 1. Try fetching from Supabase
            const { data, error: fetchError } = await supabase
                .from('invitations')
                .select('*, inviter:profiles(full_name, email), campus:campuses(name, address)')
                .eq('qr_code_value', id)
                .single()

            if (data) {
                setInvite(data)

                // 2. Auto-confirm attendance if not already attended
                if (data.status !== 'attended') {
                    const { error: updateError } = await supabase
                        .from('invitations')
                        .update({
                            status: 'attended',
                            attended_at: new Date().toISOString()
                        })
                        .eq('id', data.id)

                    if (!updateError) {
                        setAttendanceConfirmed(true)
                        // Update local state
                        setInvite({
                            ...data,
                            status: 'attended',
                            attended_at: new Date().toISOString()
                        })
                    }
                } else {
                    setAttendanceConfirmed(true)
                }
            } else {
                setError("Invitation not found.")
            }
            setLoading(false)
        }

        fetchInvite()
    }, [ id, profile, authLoading ])

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
            </div>
        </Layout>
    )

    if (error || !invite) return (
        <Layout>
            <div className="text-center mt-10 space-y-4">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-xl font-bold text-red-500">
                    {error === "Access denied. Only admins and PCU hosts can verify invitations."
                        ? "Access Denied"
                        : "Invalid Invitation"}
                </h1>
                <p className="text-gray-400">{error || "We couldn't find this invitation."}</p>
                <Link to="/"><Button>Go Home</Button></Link>
            </div>
        </Layout>
    )

    return (
        <Layout>
            <div className="w-full max-w-sm mx-auto space-y-8 mt-4">
                {/* Status Badge */}
                <div className="flex justify-center">
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${
                        invite.status === 'attended'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    }`}>
                        {invite.status === 'attended' ? 'Attendance Confirmed' : 'Valid Invitation'}
                    </span>
                </div>

                {/* Attendance Confirmation Message */}
                {attendanceConfirmed && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                        <p className="text-green-400 font-semibold">✓ Attendance has been confirmed!</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {new Date(invite.attended_at).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Main Details */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white mb-2">{invite.guest_name}</h1>
                    <p className="text-gray-400">is invited to</p>
                    <h2 className="text-2xl font-serif text-[var(--color-highlight)]">Sunday Service</h2>
                </div>

                <Card className="space-y-4 border-[var(--color-accent)]/30 bg-gradient-to-b from-white/5 to-black">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">📍</div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Location</p>
                            <p className="text-white font-medium">{invite.campus?.name}</p>
                            <p className="text-sm text-gray-500">{invite.campus?.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-white/10 pt-4">
                        <div className="mt-1">📅</div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">When</p>
                            <p className="text-white font-medium">Every Sunday</p>
                            <p className="text-sm text-gray-500">9:00 AM & 11:00 AM</p>
                        </div>
                    </div>
                </Card>

                {/* Inviter Info */}
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] font-bold">
                        {invite.inviter?.full_name?.charAt(0) || "M"}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Invited By</p>
                        <p className="text-white font-medium">{invite.inviter?.full_name || "TCN Member"}</p>
                        <p className="text-xs text-gray-500">{invite.inviter?.email}</p>
                    </div>
                </div>

                <div className="pt-8 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/pcu-checkin')}
                    >
                        Scan Next
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => navigate('/admin')}
                    >
                        Admin Dashboard
                    </Button>
                </div>
            </div>
        </Layout>
    )
}
