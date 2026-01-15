import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, LayoutDashboard } from 'lucide-react'
import logo from '../assets/images/tcn_icon_white.png'

export function Layout({ children }) {
    const { user, profile, signOut } = useAuth()
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const getInitials = () => {
        if (!profile?.full_name) return 'U'
        return profile.full_name
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="min-h-screen w-full bg-[#121212] text-white overflow-x-hidden selection:bg-(--color-accent) selection:text-white">
            {/* Background Gradients/Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-accent) opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-highlight) opacity-10 blur-[120px]" />
            </div>

            <main className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col px-4 py-8">
                {/* Header with Logo and User Menu */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="">
                        <img src={logo} alt="TCN Logo" className="h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
                    </Link>

                    {/* User Menu */}
                    {user && profile && (
                        <div className="relative flex items-center gap-2">
                            {/* Dashboard Quick Access for Admin */}
                            {(profile.role === 'admin' || profile.role === 'pcu_host') && (
                                <Link
                                    to="/admin"
                                    className="h-10 w-10 bg-white/10 hover:bg-white/20 cursor-pointer rounded-full flex items-center justify-center text-white transition-colors"
                                    title="Admin Dashboard"
                                >
                                    <LayoutDashboard size={20} />
                                </Link>
                            )}
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="h-10 w-10 bg-(--color-accent) cursor-pointer rounded-full flex items-center justify-center font-bold text-white hover:opacity-80 transition-opacity"
                            >
                                {getInitials()}
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <>
                                    {/* Backdrop to close menu */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />

                                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-lg shadow-lg overflow-hidden z-20">
                                        {/* User Info */}
                                        <div className="p-4 border-b border-white/10">
                                            <p className="font-semibold text-white">{profile.full_name}</p>
                                            <p className="text-sm text-gray-400">{profile.email}</p>
                                            <div className="mt-2">
                                                <span className="text-xs px-2 py-1 rounded bg-(--color-accent)/20 text-(--color-accent) font-medium">
                                                    {profile.role === 'admin' ? 'Admin' : profile.role === 'pcu_host' ? 'PCU Host' : 'Member'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        {profile.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setShowMenu(false)}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-white"
                                            >
                                                <LayoutDashboard size={18} />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="cursor-pointer w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors text-red-400"
                                        >
                                            <LogOut size={18} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {children}
            </main>
        </div>
    )
}
