import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { QRScanner } from '../components/QRScanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'

export default function PCUCheckIn() {
    const [ status, setStatus ] = useState('idle') // idle, scanning, success, error
    const [ guest, setGuest ] = useState(null)

    const handleScan = async (decodedText) => {
        setStatus('verifying')

        // START: Mock verification for MVP if DB is empty
        // In real app, query 'invitations' table by qr_code_value
        console.log("Scanned:", decodedText)

        // Simulate API call
        setTimeout(() => {
            if (decodedText) {
                setGuest({ name: "John Doe", campus: "TCN Ikeja", inviter: "Jane Smith" })
                setStatus('success')
            } else {
                setStatus('error')
            }
        }, 1000)
        // END Mock

        /* 
        // REAL IMPLEMENTATION
        const { data, error } = await supabase
            .from('invitations')
            .select('*, inviter:profiles(full_name)')
            .eq('qr_code_value', decodedText)
            .single()
        
        if (data) {
            setGuest(data)
            setStatus('success')
            // Update status to attended
            await supabase.from('invitations').update({ status: 'attended', attended_at: new Date() }).eq('id', data.id)
        } else {
            setStatus('error')
        }
        */
    }

    return (
        <Layout>
            <div className="flex flex-col items-center space-y-6 mt-8">
                <h1 className="text-2xl font-bold text-[var(--color-highlight)]">PCU Check-In</h1>

                {status === 'idle' && (
                    <div className="w-full flex flex-col items-center">
                        <p className="text-gray-400 mb-4">Scan guest QR code</p>
                        <QRScanner onScan={handleScan} />
                    </div>
                )}

                {status === 'verifying' && (
                    <div className="animate-pulse text-[var(--color-accent)]">Verifying...</div>
                )}

                {status === 'success' && guest && (
                    <Card className="w-full border-green-500 bg-green-900/20 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{guest.name}</h2>
                            <p className="text-green-300">Check-in Successful!</p>
                        </div>
                        <div className="text-sm text-white/60">
                            <p>Invited by: {guest.inviter}</p>
                            <p>Campus: {guest.campus}</p>
                        </div>
                        <Button onClick={() => { setStatus('idle'); setGuest(null); }} className="w-full bg-white text-green-900 hover:bg-white/90">
                            Scan Next
                        </Button>
                    </Card>
                )}

                {status === 'error' && (
                    <Card className="w-full border-red-500 bg-red-900/20 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">✕</div>
                        <h2 className="text-xl font-bold text-white">Invalid Invitation</h2>
                        <Button onClick={() => setStatus('idle')} variant="outline" className="w-full border-white/20 text-white">
                            Try Again
                        </Button>
                    </Card>
                )}
            </div>
        </Layout>
    )
}
