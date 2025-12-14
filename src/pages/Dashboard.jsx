import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Search, Plus, ScanLine } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
    const { profile, user } = useAuth()
    const isAdmin = profile?.role === 'admin' || profile?.role === 'pcu_host'
    const [recentInvites, setRecentInvites] = useState([])
    const [loadingInvites, setLoadingInvites] = useState(true)

    // Fetch recent invites from database
    useEffect(() => {
        const fetchRecentInvites = async () => {
            if (!user?.id) return

            try {
                console.log('📊 Fetching recent invites for user:', user.id)
                const { data, error } = await supabase
                    .from('invitations')
                    .select(`
                        *,
                        campuses (
                            name
                        )
                    `)
                    .eq('inviter_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (error) {
                    console.error('❌ Error fetching invites:', error)
                    throw error
                }

                console.log('✓ Recent invites fetched:', data)
                setRecentInvites(data || [])
            } catch (error) {
                console.error('❌ Failed to fetch recent invites:', error)
            } finally {
                setLoadingInvites(false)
            }
        }

        fetchRecentInvites()
    }, [user])

    // Get guest initials
    const getGuestInitials = (name) => {
        if (!name) return '?'
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'bg-yellow-500/10 text-yellow-500'
            case 'attended':
                return 'bg-green-500/10 text-green-500'
            case 'pending':
                return 'bg-blue-500/10 text-blue-500'
            default:
                return 'bg-gray-500/10 text-gray-500'
        }
    }

    return (
        <Layout>
            <div className="flex flex-col space-y-8 mt-4">
                {/* Hero Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome Back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1>
                        <p className="text-gray-400 text-sm">
                            {isAdmin ? 'Admin Dashboard' : 'Member Dashboard'}
                        </p>
                    </div>
                    {/* <div className="h-10 w-10 bg-(--color-accent) rounded-full flex items-center justify-center font-bold text-white">
                        {getInitials()}
                    </div> */}
                </div>

                {/* Stats / Quick Actions */}
                <div className={`grid ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    <Link to="/invite/new" className="col-span-1">
                        <Card className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer border-(--color-accent)/50">
                            <div className="h-10 w-10 rounded-full bg-(--color-accent)/20 flex items-center justify-center text-(--color-accent)">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold text-sm">New Invite</span>
                        </Card>
                    </Link>

                    {/* Only show PCU Check-In for admins */}
                    {isAdmin && (
                        <Link to="/pcu-checkin" className="col-span-1">
                            <Card className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer border-white/10">
                                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                    <ScanLine size={24} />
                                </div>
                                <span className="font-semibold text-sm">PCU Check-In</span>
                            </Card>
                        </Link>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Recent Invites</h2>

                    {loadingInvites ? (
                        <div className="text-center py-8 text-gray-400">
                            Loading invites...
                        </div>
                    ) : recentInvites.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No invites yet.</p>
                            <p className="text-sm mt-2">Create your first invitation to get started!</p>
                        </div>
                    ) : (
                        recentInvites.map((invite) => (
                            <div key={invite.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold text-gray-400">
                                        {getGuestInitials(invite.guest_name)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{invite.guest_name}</p>
                                        <p className="text-xs text-gray-500">
                                            {invite.campuses?.name || 'Unknown Campus'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(invite.status)}`}>
                                    {invite.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    )
}
