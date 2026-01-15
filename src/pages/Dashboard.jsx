import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui/Card'
import { Plus, ScanLine, Calendar, CheckCircle, Clock, MapPin, X, Phone, Mail, Image } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FlyerModern } from '../components/flyers/FlyerModern'
import { FlyerGolden } from '../components/flyers/FlyerGolden'
import { FlyerMinimal } from '../components/flyers/FlyerMinimal'
import { FlyerGradient } from '../components/flyers/FlyerGradient'
import { FlyerLuxury } from '../components/flyers/FlyerLuxury'

export default function Dashboard() {
    const { profile, user } = useAuth()
    const isAdmin = profile?.role === 'admin' || profile?.role === 'pcu_host'
    const [recentInvites, setRecentInvites] = useState([])
    const [loadingInvites, setLoadingInvites] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all') // all, sent, attended
    const [selectedInvite, setSelectedInvite] = useState(null) // For modal

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

    // Filter invites based on status
    const filteredInvites = useMemo(() => {
        if (statusFilter === 'all') return recentInvites
        return recentInvites.filter(invite => invite.status === statusFilter)
    }, [recentInvites, statusFilter])

    // Get counts for filter tabs
    const inviteCounts = useMemo(() => ({
        all: recentInvites.length,
        sent: recentInvites.filter(inv => inv.status === 'sent').length,
        attended: recentInvites.filter(inv => inv.status === 'attended').length,
    }), [recentInvites])

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

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

    // Get flyer component based on design ID
    const getFlyerComponent = (invite) => {
        const flyerProps = {
            guestName: invite.guest_name,
            campus: { name: invite.campuses?.name || 'Campus', address: invite.campuses?.address || '' },
            time: invite.service_time || '9:00 AM',
            qrCodeValue: `${window.location.origin}/verify/${invite.qr_code_value}`
        }

        switch (invite.flyer_design_id) {
            case 'modern':
                return <FlyerModern {...flyerProps} />
            case 'golden':
                return <FlyerGolden {...flyerProps} />
            case 'minimal':
                return <FlyerMinimal {...flyerProps} />
            case 'gradient':
                return <FlyerGradient {...flyerProps} />
            case 'luxury':
                return <FlyerLuxury {...flyerProps} />
            default:
                return <FlyerModern {...flyerProps} />
        }
    }

    // Get flyer design name
    const getFlyerDesignName = (designId) => {
        const designs = {
            modern: 'Bold Modern',
            golden: 'Elegant Gold',
            minimal: 'Clean Minimal',
            gradient: 'Royal Gradient',
            luxury: 'Black & Gold'
        }
        return designs[designId] || 'Modern'
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
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Your Invites</h2>
                        <span className="text-xs text-gray-400">{recentInvites.length} total</span>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`cursor-pointer px-4 py-2 text-xs font-medium rounded-full transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-(--color-accent) text-white shadow-lg'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            All ({inviteCounts.all})
                        </button>
                        <button
                            onClick={() => setStatusFilter('sent')}
                            className={`cursor-pointer px-4 py-2 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                                statusFilter === 'sent'
                                    ? 'bg-yellow-500 text-black shadow-lg'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Clock size={12} />
                            Invited ({inviteCounts.sent})
                        </button>
                        <button
                            onClick={() => setStatusFilter('attended')}
                            className={`cursor-pointer px-4 py-2 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                                statusFilter === 'attended'
                                    ? 'bg-green-500 text-black shadow-lg'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <CheckCircle size={12} />
                            Attended ({inviteCounts.attended})
                        </button>
                    </div>

                    {loadingInvites ? (
                        <div className="text-center py-8 text-gray-400">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--color-accent) border-r-transparent mb-2"></div>
                            <p>Loading invites...</p>
                        </div>
                    ) : filteredInvites.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            {recentInvites.length === 0 ? (
                                <>
                                    <p>No invites yet.</p>
                                    <p className="text-sm mt-2">Create your first invitation to get started!</p>
                                </>
                            ) : (
                                <p>No {statusFilter} invites found.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredInvites.map((invite) => (
                                <Card
                                    key={invite.id}
                                    className={`p-4 transition-all hover:scale-[1.01] cursor-pointer ${
                                        invite.status === 'attended'
                                            ? 'border-green-500/30 bg-green-500/5'
                                            : 'hover:bg-white/5'
                                    }`}
                                    onClick={() => setSelectedInvite(invite)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                            invite.status === 'attended'
                                                ? 'bg-linear-to-br from-green-400 to-emerald-600 text-white'
                                                : 'bg-linear-to-br from-yellow-300 to-amber-500 text-black'
                                        }`}>
                                            {getGuestInitials(invite.guest_name)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-semibold text-white truncate">{invite.guest_name}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                                        <MapPin size={12} />
                                                        <span>{invite.campuses?.name || 'Unknown Campus'}</span>
                                                    </div>
                                                </div>
                                                <div className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(invite.status)}`}>
                                                    {invite.status === 'attended' ? 'Attended' : 'Invited'}
                                                </div>
                                            </div>

                                            {/* Date Info */}
                                            <div className="mt-2 pt-2 border-t border-white/5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Calendar size={12} />
                                                        <span>Sent {formatDate(invite.created_at)}</span>
                                                    </div>
                                                    {invite.status === 'attended' && invite.attended_at && (
                                                        <div className="flex items-center gap-1.5 text-green-500">
                                                            <CheckCircle size={12} />
                                                            <span>Attended {formatDate(invite.attended_at)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Preview Modal */}
            {selectedInvite && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 z-40"
                        onClick={() => setSelectedInvite(null)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-8 md:bottom-8 md:w-full md:max-w-lg bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                    selectedInvite.status === 'attended'
                                        ? 'bg-linear-to-br from-green-400 to-emerald-600 text-white'
                                        : 'bg-linear-to-br from-yellow-300 to-amber-500 text-black'
                                }`}>
                                    {getGuestInitials(selectedInvite.guest_name)}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{selectedInvite.guest_name}</p>
                                    <div className={`inline-flex text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedInvite.status)}`}>
                                        {selectedInvite.status === 'attended' ? 'Attended' : 'Invited'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInvite(null)}
                                className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Guest Details */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Guest Details</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedInvite.guest_phone && (
                                        <div className="flex items-center gap-2 text-sm text-white bg-white/5 rounded-lg px-3 py-2">
                                            <Phone size={14} className="text-gray-400" />
                                            <span>{selectedInvite.guest_phone}</span>
                                        </div>
                                    )}
                                    {selectedInvite.guest_email && (
                                        <div className="flex items-center gap-2 text-sm text-white bg-white/5 rounded-lg px-3 py-2">
                                            <Mail size={14} className="text-gray-400" />
                                            <span>{selectedInvite.guest_email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-white bg-white/5 rounded-lg px-3 py-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>{selectedInvite.campuses?.name || 'Unknown Campus'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Timeline</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-white bg-white/5 rounded-lg px-3 py-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>Invited on {new Date(selectedInvite.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    {selectedInvite.status === 'attended' && selectedInvite.attended_at && (
                                        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 rounded-lg px-3 py-2">
                                            <CheckCircle size={14} />
                                            <span>Attended on {new Date(selectedInvite.attended_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Flyer Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Flyer Design</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-(--color-highlight) bg-(--color-highlight)/10 px-2 py-1 rounded-full">
                                        <Image size={12} />
                                        {getFlyerDesignName(selectedInvite.flyer_design_id)}
                                    </div>
                                </div>
                                <div className="relative bg-black rounded-lg overflow-hidden border border-white/10">
                                    {/* Flyer Preview - Scaled down */}
                                    <div className="transform scale-[0.5] origin-top-left w-[200%] h-auto">
                                        {getFlyerComponent(selectedInvite)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/10 shrink-0">
                            <button
                                onClick={() => {
                                    // Open WhatsApp with pre-filled message
                                    window.open(`https://wa.me/${selectedInvite.guest_phone?.replace(/\D/g, '')}?text=Hi ${selectedInvite.guest_name}, just checking in! Looking forward to seeing you at ${selectedInvite.campuses?.name || 'church'}!`, '_blank')
                                }}
                                className="cursor-pointer w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Phone size={18} />
                                Send Reminder via WhatsApp
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    )
}
