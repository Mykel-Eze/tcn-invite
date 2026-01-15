import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'
import { Users, Mail, CheckCircle, TrendingUp, Download, Search, Filter, ArrowUpDown, X, ChevronDown } from 'lucide-react'

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

    // Search, filter, and sort state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all') // all, sent, attended
    const [roleFilter, setRoleFilter] = useState('all') // all, admin, pcu_host, inviter
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })
    const [showFilters, setShowFilters] = useState(false)

    // User details modal state
    const [selectedUser, setSelectedUser] = useState(null)
    const [userInvites, setUserInvites] = useState([])

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

    // Get invite count for a user
    const getInviteCount = (userId) => {
        return invitations.filter(inv => inv.inviter_id === userId).length
    }

    // Get user's invitations
    const getUserInvitations = (userId) => {
        return invitations.filter(inv => inv.inviter_id === userId)
    }

    // Handle user click to show their invites
    const handleUserClick = (user) => {
        setSelectedUser(user)
        setUserInvites(getUserInvitations(user.id))
    }

    // Close user modal
    const closeUserModal = () => {
        setSelectedUser(null)
        setUserInvites([])
    }

    // CSV Export for Invitations
    const exportInvitationsCSV = () => {
        const headers = ['Guest Name', 'Guest Phone', 'Guest Email', 'Campus', 'Status', 'Invited By', 'Created Date', 'Attended Date']
        const csvData = filteredInvitations.map(inv => [
            inv.guest_name || '',
            inv.guest_phone || '',
            inv.guest_email || '',
            inv.campus?.name || '',
            inv.status || '',
            inv.inviter?.full_name || '',
            inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '',
            inv.attended_at ? new Date(inv.attended_at).toLocaleDateString() : ''
        ])

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n')

        downloadCSV(csvContent, 'invitations.csv')
    }

    // CSV Export for Users
    const exportUsersCSV = () => {
        const headers = ['Full Name', 'Email', 'Role', 'Invite Count', 'Created Date']
        const csvData = filteredUsers.map(user => [
            user.full_name || '',
            user.email || '',
            user.role === 'admin' ? 'Admin' : user.role === 'pcu_host' ? 'PCU Host' : 'Member',
            getInviteCount(user.id),
            user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
        ])

        const csvContent = [headers, ...csvData]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n')

        downloadCSV(csvContent, 'users.csv')
    }

    // Download CSV helper
    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
    }

    // Handle sort
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('')
        setStatusFilter('all')
        setRoleFilter('all')
        setSortConfig({ key: 'created_at', direction: 'desc' })
    }

    // Filter and sort invitations
    const filteredInvitations = useMemo(() => {
        let result = [...invitations]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(inv =>
                inv.guest_name?.toLowerCase().includes(query) ||
                inv.guest_phone?.toLowerCase().includes(query) ||
                inv.guest_email?.toLowerCase().includes(query) ||
                inv.campus?.name?.toLowerCase().includes(query) ||
                inv.inviter?.full_name?.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(inv => inv.status === statusFilter)
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortConfig.key]
            let bVal = b[sortConfig.key]

            if (sortConfig.key === 'guest_name') {
                aVal = a.guest_name || ''
                bVal = b.guest_name || ''
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [invitations, searchQuery, statusFilter, sortConfig])

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        let result = [...users]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(user =>
                user.full_name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            )
        }

        // Role filter
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter)
        }

        // Sort
        result.sort((a, b) => {
            let aVal, bVal

            if (sortConfig.key === 'invite_count') {
                aVal = getInviteCount(a.id)
                bVal = getInviteCount(b.id)
            } else {
                aVal = a[sortConfig.key] || ''
                bVal = b[sortConfig.key] || ''
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [users, searchQuery, roleFilter, sortConfig, invitations])

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

                {/* Search, Filter & Sort Bar - Show for users and invitations tabs */}
                {(activeTab === 'users' || activeTab === 'invitations') && (
                    <div className="space-y-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'users' ? 'Search users by name or email...' : 'Search invitations...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-(--color-accent)"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter & Sort Row */}
                        <div className="flex gap-2 flex-wrap items-center">
                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                    showFilters ? 'bg-(--color-accent)/20 border-(--color-accent) text-(--color-accent)' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                }`}
                            >
                                <Filter size={14} />
                                Filters
                                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => handleSort(activeTab === 'users' ? 'full_name' : 'guest_name')}
                                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border bg-white/5 border-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ArrowUpDown size={14} />
                                    Sort by Name
                                </button>
                            </div>

                            <button
                                onClick={() => handleSort('created_at')}
                                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border bg-white/5 border-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowUpDown size={14} />
                                Sort by Date
                            </button>

                            {activeTab === 'users' && (
                                <button
                                    onClick={() => handleSort('invite_count')}
                                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border bg-white/5 border-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ArrowUpDown size={14} />
                                    Sort by Invites
                                </button>
                            )}

                            {/* Export Button */}
                            <button
                                onClick={activeTab === 'users' ? exportUsersCSV : exportInvitationsCSV}
                                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20 transition-colors ml-auto"
                            >
                                <Download size={14} />
                                Export CSV
                            </button>

                            {/* Clear Filters */}
                            {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="cursor-pointer text-xs text-red-400 hover:text-red-300"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="flex gap-2 flex-wrap p-3 bg-white/5 rounded-lg border border-white/10">
                                {activeTab === 'invitations' && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Status</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="block px-3 py-1.5 text-xs bg-black border border-white/20 rounded text-white focus:outline-none focus:border-(--color-accent)"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="sent">Sent</option>
                                            <option value="attended">Attended</option>
                                        </select>
                                    </div>
                                )}
                                {activeTab === 'users' && (
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Role</label>
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="block px-3 py-1.5 text-xs bg-black border border-white/20 rounded text-white focus:outline-none focus:border-(--color-accent)"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="admin">Admin</option>
                                            <option value="pcu_host">PCU Host</option>
                                            <option value="inviter">Member</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Results Count */}
                        <p className="text-xs text-gray-400">
                            Showing {activeTab === 'users' ? filteredUsers.length : filteredInvitations.length} of {activeTab === 'users' ? users.length : invitations.length} {activeTab}
                        </p>
                    </div>
                )}

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
                        {filteredUsers.map((user) => (
                            <Card
                                key={user.id}
                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        {/* Left side - Avatar, Name, Email, Role */}
                                        <div className="flex gap-3">
                                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-white">{user.full_name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                                <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role === 'admin' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    )}
                                                    {user.role === 'pcu_host' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    )}
                                                    {user.role === 'inviter' && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    )}
                                                    {user.role === 'admin' ? 'Admin' : user.role === 'pcu_host' ? 'PCU Host' : 'Member'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Invite Count */}
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                                <Mail size={14} className="text-purple-400" />
                                                <span className="text-sm font-semibold text-purple-400">{getInviteCount(user.id)}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wide">invites</span>
                                        </div>
                                    </div>

                                    {/* Role Management - Only show for non-admin users */}
                                    {user.role !== 'admin' && (
                                        <div className="flex gap-2 pt-3 border-t border-white/10">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRoleChange(user.id, 'inviter'); }}
                                                className={`cursor-pointer flex-1 px-3 py-2 text-xs rounded-lg transition-all ${
                                                    user.role === 'inviter'
                                                        ? 'bg-(--color-accent)/20 text-(--color-accent) border border-(--color-accent)/30 shadow-sm'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}
                                            >
                                                Member
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRoleChange(user.id, 'pcu_host'); }}
                                                className={`cursor-pointer flex-1 px-3 py-2 text-xs rounded-lg transition-all ${
                                                    user.role === 'pcu_host'
                                                        ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30 shadow-sm'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                                }`}
                                            >
                                                PCU Host
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                        {filteredUsers.length === 0 && (
                            <p className="text-center text-gray-400 py-8">No users found matching your criteria.</p>
                        )}
                    </div>
                )}

                {activeTab === 'invitations' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">All Invitations</h2>
                        {filteredInvitations.map((invitation) => (
                            <Card key={invitation.id} className="p-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{invitation.guest_name}</p>
                                            <p className="text-xs text-gray-400">{invitation.guest_phone}</p>
                                            {invitation.guest_email && (
                                                <p className="text-xs text-gray-400">{invitation.guest_email}</p>
                                            )}
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
                        {filteredInvitations.length === 0 && (
                            <p className="text-center text-gray-400 py-8">No invitations found matching your criteria.</p>
                        )}
                    </div>
                )}

                {/* User Invites Modal */}
                {selectedUser && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/70 z-40"
                            onClick={closeUserModal}
                        />

                        {/* Modal */}
                        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold">
                                        {selectedUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{selectedUser.full_name}</p>
                                        <p className="text-xs text-gray-400">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeUserModal}
                                    className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 overflow-y-auto flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-white">Invitations ({userInvites.length})</h3>
                                    <div className="text-xs text-gray-400">
                                        {userInvites.filter(inv => inv.status === 'attended').length} attended
                                    </div>
                                </div>

                                {userInvites.length > 0 ? (
                                    <div className="space-y-3">
                                        {userInvites.map((invitation) => (
                                            <div key={invitation.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-medium text-sm text-white">{invitation.guest_name}</p>
                                                    <div className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(invitation.status)}`}>
                                                        {invitation.status === 'attended' ? 'Attended' : 'Sent'}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 space-y-1">
                                                    {invitation.guest_phone && <p>Phone: {invitation.guest_phone}</p>}
                                                    {invitation.guest_email && <p>Email: {invitation.guest_email}</p>}
                                                    <p>Campus: {invitation.campus?.name}</p>
                                                    <p>Created: {new Date(invitation.created_at).toLocaleDateString()}</p>
                                                    {invitation.attended_at && (
                                                        <p className="text-green-500">Attended: {new Date(invitation.attended_at).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">This user hasn't sent any invitations yet.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}
