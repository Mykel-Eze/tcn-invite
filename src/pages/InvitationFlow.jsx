import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng } from 'html-to-image'
import { Layout } from '../components/Layout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { FlyerModern } from '../components/flyers/FlyerModern'
import { FlyerGolden } from '../components/flyers/FlyerGolden'
import { FlyerMinimal } from '../components/flyers/FlyerMinimal'
import { supabase } from '../lib/supabase'

// Mock Campuses if DB fetch fails
const MOCK_CAMPUSES = [
    { id: '1', name: 'TCN Ikeja', address: '123 Allen Avenue, Ikeja', service_times: [ '9:00 AM', '11:00 AM' ] },
    { id: '2', name: 'TCN Lekki', address: 'Admiralty Way, Lekki', service_times: [ '10:00 AM' ] },
    { id: '3', name: 'TCN Abuja', address: 'Central Business District', service_times: [ '9:00 AM' ] },
]

export default function InvitationFlow() {
    const [ step, setStep ] = useState(1)
    const [ guestData, setGuestData ] = useState({ name: '', phone: '', location: '' })
    const [ selectedCampus, setSelectedCampus ] = useState(MOCK_CAMPUSES[ 0 ])
    const [ selectedTime, setSelectedTime ] = useState(MOCK_CAMPUSES[ 0 ].service_times[ 0 ])
    const [ selectedFlyer, setSelectedFlyer ] = useState(null) // 'modern', 'golden', 'minimal'
    const [ generatedImage, setGeneratedImage ] = useState(null)

    const flyerRef = useRef(null)

    const handleInputChange = (e) => {
        setGuestData({ ...guestData, [ e.target.name ]: e.target.value })
    }

    const handleGenerateClick = async () => {
        if (flyerRef.current === null) {
            return
        }
        try {
            const dataUrl = await toPng(flyerRef.current, { cacheBust: true, })
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
                                    <select
                                        className="flex h-12 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] [&>option]:bg-black"
                                        value={selectedCampus.id}
                                        onChange={(e) => {
                                            const campus = MOCK_CAMPUSES.find(c => c.id === e.target.value)
                                            setSelectedCampus(campus)
                                            setSelectedTime(campus.service_times[ 0 ])
                                        }}
                                    >
                                        {MOCK_CAMPUSES.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-white/80 block ml-1">Service Time</label>
                                    <div className="flex gap-2">
                                        {selectedCampus.service_times.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-3 py-1 rounded-md text-sm border transition-colors ${selectedTime === time ? 'border-[var(--color-highlight)] text-[var(--color-highlight)] bg-[var(--color-highlight)]/10' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={() => {
                                        if (guestData.name) setStep(2)
                                    }}
                                    disabled={!guestData.name}
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

                            {/* Flyer Preview Carousel - simplified as stacked list for now or horizontal scroll */}
                            <div className="flex justify-center gap-4 flex-wrap pb-4">
                                {/* Only render one at a time for 'preview' or show thumbnails? 
                     I'll show thumbnails scaling down the components.
                 */}
                                <div className="space-y-6">
                                    <div
                                        className={`cursor-pointer transition-all ${selectedFlyer === 'modern' ? 'ring-4 ring-[var(--color-accent)] scale-105' : 'opacity-70 hover:opacity-100'}`}
                                        onClick={() => setSelectedFlyer('modern')}
                                    >
                                        <p className="text-center text-xs mb-2 text-gray-400">Bold Modern</p>
                                        <div className="scale-75 origin-top transform h-[380px] w-[300px] pointer-events-none border border-white/20">
                                            <FlyerModern guestName={guestData.name} campus={selectedCampus} time={selectedTime} />
                                        </div>
                                    </div>

                                    <div
                                        className={`cursor-pointer transition-all ${selectedFlyer === 'golden' ? 'ring-4 ring-[var(--color-highlight)] scale-105' : 'opacity-70 hover:opacity-100'}`}
                                        onClick={() => setSelectedFlyer('golden')}
                                    >
                                        <p className="text-center text-xs mb-2 text-gray-400">Elegant Gold</p>
                                        <div className="scale-75 origin-top transform h-[380px] w-[300px] pointer-events-none border border-white/20">
                                            <FlyerGolden guestName={guestData.name} campus={selectedCampus} time={selectedTime} />
                                        </div>
                                    </div>

                                    <div
                                        className={`cursor-pointer transition-all ${selectedFlyer === 'minimal' ? 'ring-4 ring-white scale-105' : 'opacity-70 hover:opacity-100'}`}
                                        onClick={() => setSelectedFlyer('minimal')}
                                    >
                                        <p className="text-center text-xs mb-2 text-gray-400">Clean Minimal</p>
                                        <div className="scale-75 origin-top transform h-[380px] w-[300px] pointer-events-none border border-white/20">
                                            <FlyerMinimal guestName={guestData.name} campus={selectedCampus} time={selectedTime} />
                                        </div>
                                    </div>
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
                                {selectedFlyer === 'modern' && <FlyerModern ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} />}
                                {selectedFlyer === 'golden' && <FlyerGolden ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} />}
                                {selectedFlyer === 'minimal' && <FlyerMinimal ref={flyerRef} guestName={guestData.name} campus={selectedCampus} time={selectedTime} />}
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
