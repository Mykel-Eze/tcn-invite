import React, { useCallback, useState } from 'react'
import { Layout } from '../components/Layout'
import { QRScanner } from '../components/QRScanner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

// QR codes encode a verification URL like `${origin}/verify/<uuid>`,
// but accept a bare UUID too in case an older flyer encoded just the code.
const extractQrCode = (decodedText) => {
    const match = String(decodedText || '').match(UUID_REGEX)
    return match ? match[ 0 ] : null
}

export default function PCUCheckIn() {
    const [ status, setStatus ] = useState('idle') // idle, verifying, success, already, error
    const [ guest, setGuest ] = useState(null)
    const [ errorMessage, setErrorMessage ] = useState('')

    const handleScan = useCallback(async (decodedText) => {
        setStatus('verifying')
        setErrorMessage('')

        const qrCode = extractQrCode(decodedText)
        if (!qrCode) {
            setErrorMessage('This QR code is not a TCN invitation.')
            setStatus('error')
            return
        }

        try {
            const { data, error } = await supabase
                .from('invitations')
                .select('*, inviter:profiles!inviter_id(full_name), campus:campuses(name)')
                .eq('qr_code_value', qrCode)
                .single()

            if (error || !data) {
                setErrorMessage('Invitation not found.')
                setStatus('error')
                return
            }

            const guestInfo = {
                name: data.guest_name,
                campus: data.campus?.name || 'TCN',
                inviter: data.inviter?.full_name || 'TCN Member',
                attendedAt: data.attended_at,
            }

            if (data.status === 'attended') {
                setGuest(guestInfo)
                setStatus('already')
                return
            }

            const { error: updateError } = await supabase
                .from('invitations')
                .update({ status: 'attended', attended_at: new Date().toISOString() })
                .eq('id', data.id)

            if (updateError) {
                setErrorMessage('Found the invitation but could not confirm attendance. Please try again.')
                setStatus('error')
                return
            }

            setGuest(guestInfo)
            setStatus('success')
        } catch (err) {
            console.error('Check-in error:', err)
            setErrorMessage('Something went wrong while verifying. Please try again.')
            setStatus('error')
        }
    }, [])

    const resetScanner = () => {
        setStatus('idle')
        setGuest(null)
        setErrorMessage('')
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
                        <Button onClick={resetScanner} className="w-full bg-white text-green-900 hover:bg-white/90">
                            Scan Next
                        </Button>
                    </Card>
                )}

                {status === 'already' && guest && (
                    <Card className="w-full border-yellow-500 bg-yellow-900/20 text-center space-y-4">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto text-3xl">!</div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{guest.name}</h2>
                            <p className="text-yellow-300">Already checked in</p>
                            {guest.attendedAt && (
                                <p className="text-xs text-white/60 mt-1">
                                    {new Date(guest.attendedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="text-sm text-white/60">
                            <p>Invited by: {guest.inviter}</p>
                            <p>Campus: {guest.campus}</p>
                        </div>
                        <Button onClick={resetScanner} className="w-full bg-white text-yellow-900 hover:bg-white/90">
                            Scan Next
                        </Button>
                    </Card>
                )}

                {status === 'error' && (
                    <Card className="w-full border-red-500 bg-red-900/20 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">✕</div>
                        <h2 className="text-xl font-bold text-white">Invalid Invitation</h2>
                        {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
                        <Button onClick={resetScanner} variant="outline" className="w-full border-white/20 text-white">
                            Try Again
                        </Button>
                    </Card>
                )}
            </div>
        </Layout>
    )
}
