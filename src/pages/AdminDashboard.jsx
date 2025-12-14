import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'
import { Users, Mail, CheckCircle, TrendingUp, Shield, UserCog } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalInvitations: 0,
        attendedInvitations: 0,
        totalUsers: 0,
        conversionRate: 0,
    })
    const [users, setUsers] = useState([])
    const [invitations, setInvitations] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview') // overview, users, invitations

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch all invitations
            const { data: invitationsData, error: invError } = await supabase
                .from('invitations')
                .select(`
                    *,
                    inviter:profiles!inviter_id(full_name, email),
                    campus:campuses(name, address)
                `)
                .order('created_at', { ascending: false })

            if (invError) throw invError

            // Fetch all users
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (usersError) throw usersError

            // Calculate statistics
            const totalInvitations = invitationsData?.length || 0
            const attendedInvitations = invitationsData?.filter(inv => inv.status === 'attended').length || 0
            const conversionRate = totalInvitations > 0
                ? ((attendedInvitations / totalInvitations) * 100).toFixed(1)
                : 0

            setStats({
                totalInvitations,
                attendedInvitations,
                totalUsers: usersData?.length || 0,
                conversionRate,
            })

            setInvitations(invitationsData || [])
            setUsers(usersData || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            // Refresh users list
            await fetchDashboardData()
            alert('User role updated successfully!')
        } catch (error) {
            console.error('Error updating role:', error)
            alert('Failed to update user role: ' + error.message)
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'pcu_host':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const getStatusBadgeColor = (status) => {
        return status === 'attended'
            ? 'bg-green-500/10 text-green-500'
            : 'bg-yellow-500/10 text-yellow-500'
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-(--color-accent) border-r-transparent"></div>
                        <p className="text-white mt-4">Loading dashboard...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="flex flex-col space-y-6 mt-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm">Manage users and view analytics</p>
                    </div>
                    <Link to="/">
                        <Button variant="outline" size="sm">Back to Home</Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-(--color-accent)/20 flex items-center justify-center">
                                <Mail size={20} className="text-(--color-accent)" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalInvitations}</p>
                                <p className="text-xs text-gray-400">Total Invites</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle size={20} className="text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.attendedInvitations}</p>
                                <p className="text-xs text-gray-400">Attended</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Users size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                <p className="text-xs text-gray-400">Total Users</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <TrendingUp size={20} className="text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                                <p className="text-xs text-gray-400">Conversion</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'overview'
                                ? 'text-white border-b-2 border-(--color-accent)'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'users'
                                ? 'text-white border-b-2 border-(--color-accent)'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Users ({stats.totalUsers})
                    </button>
                    <button
                        onClick={() => setActiveTab('invitations')}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'invitations'
                                ? 'text-white border-b-2 border-(--color-accent)'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Invitations ({stats.totalInvitations})
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">Recent Activity</h2>
                        {invitations.slice(0, 5).map((invitation) => (
                            <Card key={invitation.id} className="p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">{invitation.guest_name}</p>
                                        <p className="text-xs text-gray-400">
                                            {invitation.campus?.name} • {invitation.inviter?.full_name}
                                        </p>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(invitation.status)}`}>
                                        {invitation.status === 'attended' ? 'Attended' : 'Sent'}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">All Users</h2>
                        {users.map((user) => (
                            <Card key={user.id} className="p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold">
                                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.full_name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role === 'admin' ? 'Admin' : user.role === 'pcu_host' ? 'PCU Host' : 'Member'}
                                        </div>
                                    </div>

                                    {/* Role Management - Only show for non-admin users */}
                                    {user.role !== 'admin' && (
                                        <div className="flex gap-2 pt-2 border-t border-white/10">
                                            <button
                                                onClick={() => handleRoleChange(user.id, 'inviter')}
                                                className={`cursor-pointer flex-1 px-3 py-2 text-xs rounded transition-colors ${
                                                    user.role === 'inviter'
                                                        ? 'bg-(--color-accent)/20 text-(--color-accent) border border-(--color-accent)/30'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                Member
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(user.id, 'pcu_host')}
                                                className={`cursor-pointer flex-1 px-3 py-2 text-xs rounded transition-colors ${
                                                    user.role === 'pcu_host'
                                                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                PCU Host
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === 'invitations' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">All Invitations</h2>
                        {invitations.map((invitation) => (
                            <Card key={invitation.id} className="p-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{invitation.guest_name}</p>
                                            <p className="text-xs text-gray-400">{invitation.guest_phone}</p>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(invitation.status)}`}>
                                            {invitation.status === 'attended' ? 'Attended' : 'Sent'}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <p>Campus: {invitation.campus?.name}</p>
                                        <p>Invited by: {invitation.inviter?.full_name}</p>
                                        <p>Created: {new Date(invitation.created_at).toLocaleDateString()}</p>
                                        {invitation.attended_at && (
                                            <p className="text-green-500">Attended: {new Date(invitation.attended_at).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
