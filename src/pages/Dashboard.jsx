import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Search, Plus, ScanLine } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
    const { profile } = useAuth()
    const isAdmin = profile?.role === 'admin' || profile?.role === 'pcu_host'

    // Get user initials
    // const getInitials = () => {
    //     if (!profile?.full_name) return 'M'
    //     return profile.full_name
    //         .split(' ')
    //         .map(name => name[0])
    //         .join('')
    //         .toUpperCase()
    //         .substring(0, 2)
    // }

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

                    {[ 1, 2, 3 ].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold text-gray-500">
                                    JD
                                </div>
                                <div>
                                    <p className="font-medium text-sm">John Doe</p>
                                    <p className="text-xs text-gray-500">TCN Ikeja • 9:00 AM</p>
                                </div>
                            </div>
                            <div className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-500">
                                Sent
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}
