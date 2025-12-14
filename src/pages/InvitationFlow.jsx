/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng } from 'html-to-image'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { FlyerModern } from '../components/flyers/FlyerModern'
import { FlyerGolden } from '../components/flyers/FlyerGolden'
import { FlyerMinimal } from '../components/flyers/FlyerMinimal'
import { FlyerGradient } from '../components/flyers/FlyerGradient'
import { FlyerLuxury } from '../components/flyers/FlyerLuxury'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function InvitationFlow() {
    const { user } = useAuth()
    const [ step, setStep ] = useState(1)
    const [ guestData, setGuestData ] = useState({ name: '', phone: '', location: '' })
    const [ campuses, setCampuses ] = useState([])
    const [ selectedCampus, setSelectedCampus ] = useState(null)
    const [ selectedTime, setSelectedTime ] = useState('')
    const [ selectedFlyer, setSelectedFlyer ] = useState(null) // 'modern', 'golden', 'minimal'
    const [ generatedImage, setGeneratedImage ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    const flyerRef = useRef(null)

    // Fetch campuses from database
    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                console.log('📍 Fetching campuses from database...')
                const { data, error } = await supabase
                    .from('campuses')
                    .select('*')
                    .order('name')

                if (error) {
                    console.error('❌ Error fetching campuses:', error)
                    throw error
                }

                console.log('✓ Campuses fetched:', data)
                setCampuses(data)

                // Set default selections
                if (data && data.length > 0) {
                    setSelectedCampus(data[0])
                    setSelectedTime(data[0].service_times?.[0] || '')
                }
            } catch (error) {
                console.error('❌ Failed to fetch campuses:', error)
                // Show error to user
                alert('Failed to load campuses. Please refresh the page.')
            } finally {
                setLoading(false)
            }
        }

        fetchCampuses()
    }, [])

    const handleInputChange = (e) => {
        setGuestData({ ...guestData, [ e.target.name ]: e.target.value })
    }

    const [ qrCodeValue, setQrCodeValue ] = useState('')

    const handleGenerateClick = async () => {
        if (flyerRef.current === null) return

        try {
            // 1. Generate unique ID
            const uniqueId = crypto.randomUUID()
            const verificationUrl = `${window.location.origin}/verify/${uniqueId}`
            setQrCodeValue(verificationUrl)

            // 2. Save Invite to Supabase with authenticated user as inviter
            const { error } = await supabase.from('invitations').insert({
                qr_code_value: uniqueId,
                guest_name: guestData.name,
                guest_phone: guestData.phone,
                campus_id: selectedCampus.id,
                flyer_design_id: selectedFlyer,
                status: 'sent',
                inviter_id: user?.id, // Use authenticated user's ID
                delivery_method: 'download', // Default to download, can be updated when WhatsApp is clicked
            })

            if (error) {
                console.error('Error saving invitation:', error)
                // Continue anyway - the invitation will still work for the guest
            }

            // Wait a tick for React to render the QRCode with the new Value
            await new Promise(r => setTimeout(r, 500))

            // 3. Capture
            const dataUrl = await toPng(flyerRef.current, { cacheBust: true })
            setGeneratedImage(dataUrl)
            setStep(3)
        } catch (err) {
            console.error(err)
            alert("Failed to generate flyer image.")
        }
    }

    const downloadImage = () => {
        if (!generatedImage) return
        const link = document.createElement('a')
        link.download = `invite-${guestData.name}.png`
        link.href = generatedImage
        link.click()
    }

    return (
        <Layout>
            <div className="flex-1 flex flex-col items-center">
                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8">
                    {[ 1, 2, 3 ].map((s) => (
                        <div key={s} className={`h-1 w-12 rounded-full transition-colors ${s <= step ? 'bg-[var(--color-accent)]' : 'bg-white/20'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full max-w-sm space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">New Invitation</h1>
                                <p className="text-gray-400 text-sm">Enter guest details to create a personalized invite.</p>
                            </div>

                            <Card className="space-y-4">
                                <Input
                                    name="name"
                                    label="Guest Name"
                                    placeholder="e.g. John Doe"
                                    value={guestData.name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="+234..."
                                    value={guestData.phone}
                                    onChange={handleInputChange}
                                />

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-white/80 block ml-1">Select Campus</label>
                                    {loading ? (
                                        <div className="flex h-12 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 items-center text-sm text-gray-400">
                                            Loading campuses...
                                        </div>
                                    ) : (
                                        <select
                                            className="flex h-12 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) [&>option]:bg-black"
                                            value={selectedCampus?.id || ''}
                                            onChange={(e) => {
                                                const campus = campuses.find(c => c.id === e.target.value)
                                                setSelectedCampus(campus)
                                                setSelectedTime(campus?.service_times?.[0] || '')
                                            }}
                                        >
                                            {campuses.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-white/80 block ml-1">Service Time</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedCampus?.service_times?.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`cursor-pointer px-3 py-1 rounded-md text-sm border transition-colors ${selectedTime === time ? 'border-(--color-highlight) text-(--color-highlight) bg-(--color-highlight)/10' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={() => {
                                        if (guestData.name && selectedCampus) setStep(2)
                                    }}
                                    disabled={!guestData.name || !selectedCampus || loading}
                                >
                                    Next: Select Design
                                </Button>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full space-y-6 flex flex-col items-center"
                        >
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">Choose a Style</h1>
                                <p className="text-gray-400 text-sm">Select the flyer design you like best.</p>
                            </div>

                            {/* Flyer Preview Carousel - Vertical Scroll */}
                            <div className="w-full overflow-y-auto max-h-[60vh] pb-[60px] px-4">
                                <div className="space-y-8">
                                    {[
                                        { id: 'modern', name: 'Bold Modern', Component: FlyerModern },
                                        { id: 'golden', name: 'Elegant Gold', Component: FlyerGolden },
                                        { id: 'minimal', name: 'Clean Minimal', Component: FlyerMinimal },
                                        { id: 'gradient', name: 'Royal Gradient', Component: FlyerGradient },
                                        { id: 'luxury', name: 'Black & Gold', Component: FlyerLuxury },
                                    ].map(({ id, name, Component }) => (
                                        <div
                                            key={id}
                                            className={`cursor-pointer transition-all ${selectedFlyer === id ? 'p-4 ring-4 ring-(--color-accent) scale-105' : 'opacity-70 hover:opacity-100'} flex flex-col items-center`}
                                            onClick={() => setSelectedFlyer(id)}
                                        >
                                            <p className="text-center text-xs mb-3 text-gray-400 font-bold uppercase tracking-widest">{name}</p>
                                            <div className="w-full max-w-[300px] border border-white/20 rounded-lg overflow-hidden shadow-2xl bg-black">
                                                <Component guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue="PREVIEW" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="fixed bottom-8 left-0 right-0 px-4 flex gap-4 max-w-md mx-auto z-50">
                                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 bg-black/50 backdrop-blur">Back</Button>
                                <Button
                                    className="flex-[2]"
                                    disabled={!selectedFlyer}
                                    onClick={handleGenerateClick}
                                >
                                    Generate & Share
                                </Button>
                            </div>

                            {/* Hidden container for generation */}
                            <div className="fixed top-0 left-[-9999px]">
                                {selectedFlyer === 'modern' && <FlyerModern ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue={qrCodeValue} />}
                                {selectedFlyer === 'golden' && <FlyerGolden ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue={qrCodeValue} />}
                                {selectedFlyer === 'minimal' && <FlyerMinimal ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue={qrCodeValue} />}
                                {selectedFlyer === 'gradient' && <FlyerGradient ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue={qrCodeValue} />}
                                {selectedFlyer === 'luxury' && <FlyerLuxury ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} qrCodeValue={qrCodeValue} />}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col items-center space-y-6"
                        >
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-[var(--color-highlight)]">Ready!</h1>
                                <p className="text-gray-400 text-sm">Send this to {guestData.name}.</p>
                            </div>

                            {generatedImage && (
                                <img src={generatedImage} alt="Invitation" className="w-[300px] rounded-lg shadow-2xl border border-white/20" />
                            )}

                            <div className="w-full space-y-3">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={downloadImage}>
                                    Download Image
                                </Button>
                                <Button variant="secondary" className="w-full" onClick={() => window.open(`https://wa.me/?text=Hi ${guestData.name}, I'd love to invite you to church at ${selectedCampus.name}!`, '_blank')}>
                                    Share on WhatsApp
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={() => { setStep(1); setGuestData({ name: '', phone: '', location: '' }); }}>
                                    Create Another
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    )
}
