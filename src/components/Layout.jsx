import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/tcn_logo.png'

export function Layout({ children }) {
    return (
        <div className="min-h-screen w-full bg-[#121212] text-white overflow-x-hidden selection:bg-[var(--color-accent)] selection:text-white">
            {/* Background Gradients/Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-accent)] opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-highlight)] opacity-10 blur-[120px]" />
            </div>

            <main className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col px-4 py-8">
                {/* Logo Header */}
                <div className="flex justify-center mb-6">
                    <Link to="/" className="tcn-logo-wrapper">
                        <img src={logo} alt="TCN Logo" className="h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
                    </Link>
                </div>

                {children}
            </main>
        </div>
    )
}
