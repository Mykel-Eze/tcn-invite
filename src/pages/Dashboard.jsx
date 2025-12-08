import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Search, Plus, ScanLine } from 'lucide-react'

export default function Dashboard() {
    return (
        <Layout>
            <div className="flex flex-col space-y-8 mt-4">
                {/* Hero Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Member Dashboard</p>
                    </div>
                    <div className="h-10 w-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center font-bold text-white">
                        M
                    </div>
                </div>

                {/* Stats / Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/invite/new" className="col-span-1">
                        <Card className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer border-[var(--color-accent)]/50">
                            <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold text-sm">New Invite</span>
                        </Card>
                    </Link>

                    <Link to="/pcu-checkin" className="col-span-1">
                        <Card className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer border-white/10">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <ScanLine size={24} />
                            </div>
                            <span className="font-semibold text-sm">PCU Check-In</span>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Recent Invites</h2>

                    {[ 1, 2, 3 ].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold text-gray-500">
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
