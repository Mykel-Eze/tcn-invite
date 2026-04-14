import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import churchLogo from "../../assets/images/tcn_logo_white.png"
import backgroundImage from "../../assets/images/rep_the_cross.jpeg"

const FlyerRepCross3 = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] relative flex flex-col shadow-2xl overflow-hidden font-sans text-white bg-[#12040b]">
            {/* --- BACKGROUND IMAGE & PREMIUM GRADIENT --- */}
            <div className="absolute inset-0">
                {/* Image background with reduced opacity/overlay to show it prominently */}
                <img src={backgroundImage} alt="Rep the Cross Background" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#12040b]/60 via-[#732758]/40 to-[#12040b]/80" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D9644A] rounded-full blur-[100px] opacity-30 mix-blend-screen" />
            </div>

            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />

            {/* --- HEADER --- */}
            <div className="px-5 pt-6 pb-2 flex justify-between items-center z-10 shrink-0">
                <img src={churchLogo} alt="TCN" className="h-6 w-auto opacity-95 drop-shadow-md" />
                <span className="text-[8px] tracking-widest uppercase font-bold text-[#D9644A] border border-[#D9644A]/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                    BAFF Sunday
                </span>
            </div>

            {/* --- MIDDLE: SPACING --- */}
            <div className="relative z-10 flex-1">
                 {/* Empty space allows background to be more prominent */}
            </div>

            {/* --- BOTTOM: TITLE & GUEST CARD --- */}
            <div className="p-3 flex flex-col justify-end z-10 min-h-0">
                {/* HERO TYPOGRAPHY Moved here */}
                <div className="w-full text-center space-y-1 relative mb-4">
                    <h1 className="text-[2.2rem] font-bold uppercase tracking-tight text-white/90 leading-none drop-shadow-md">
                        Rep The
                    </h1>
                    <div className="relative flex justify-center">
                        <h1 className="text-[4rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D9644A] via-white to-[#D9644A] leading-[0.75] tracking-tighter filter drop-shadow-[0_0_20px_rgba(217,100,74,0.4)]">
                            Cross
                        </h1>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 flex flex-col relative text-[#12040b] shadow-xl">
                    {/* Guest Header */}
                    <div className="mb-2 border-b border-gray-100 pb-2">
                        <p className="text-[8px] text-[#A62957] font-bold uppercase tracking-wider mb-0.5">Special Invitation For</p>
                        <h2 className="text-lg font-black leading-none truncate px-1">{guestName || "Special Guest"}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-start gap-2">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase text-[#12040b] leading-tight mb-0.5 truncate">{campus?.name || "TCN Campus"}</p>
                                    <p className="text-[9px] text-gray-500 leading-tight">{campus?.address}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-[#A62957]">
                                    {time || "9:00 AM"}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600">This Sunday</span>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm shrink-0">
                            <QRCodeCanvas value={qrCodeValue || "sample"} size={45} fgColor="#A62957" bgColor="#FFFFFF" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Color Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#D9644A] via-[#BF3978] to-[#12040b]" />
        </div>
    )
})

FlyerRepCross3.displayName = "FlyerRepCross3"
export { FlyerRepCross3 }
