import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import backgroundImage from "../../assets/images/rep_the_cross.jpeg"
import churchLogo from "../../assets/images/tcn_logo_white.png"

const FlyerRepCross1 = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] relative flex flex-col shadow-2xl overflow-hidden font-sans text-white bg-black">
            {/* --- BACKGROUND IMAGE --- */}
            <div className="absolute inset-0">
                <img src={backgroundImage} alt="Rep the Cross Background" className="w-full h-full object-cover opacity-100 mix-blend-screen" />
                {/* Dark gradients to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />
            </div>

            {/* --- TOP SECTION: BRANDING --- */}
            <div className="pt-6 px-6 z-10 flex flex-col items-center">
                <img src={churchLogo} alt="The Covenant Nation" className="w-[110px] h-auto object-contain drop-shadow-md opacity-95" />
            </div>

            <div>
                <p className="pt-5 text-[9px] uppercase tracking-[0.2em] font-bold text-[#D9644A] mb-1 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    You are specially invited to
                </p>
            </div>

            {/* --- MIDDLE: SPACING FOR BACKGROUND --- */}
            <div className="relative z-10 flex-1">
                {/* Empty space allows background to be more prominent */}
            </div>

            {/* --- BOTTOM: TITLE & GUEST CARD --- */}
            <div className="px-3 pb-3 flex flex-col justify-end z-10">
                {/* Event Title Typography */}
                <div className="w-full flex flex-col items-center justify-center relative mb-3">
                    <h1 className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-none text-center">
                        REP THE
                    </h1>
                    <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#D9644A] via-[#BF3978] to-[#D9644A] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] leading-[0.85] text-center mt-[-4px]">
                        CROSS
                    </h1>
                </div>

                {/* Guest Card (Glassmorphism) */}
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 opacity-50" />

                    <div className="flex gap-3 items-end">
                        <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-[#D9644A] font-bold uppercase mb-0.5 tracking-wider">Join us this Sunday</p>
                            <h2 className="text-lg font-black leading-none truncate text-white mb-2">{guestName || "Special Guest"}</h2>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-3 rounded-full bg-[#BF3978]" />
                                    <div>
                                        <p className="text-[9px] font-bold text-white leading-none">{campus?.name || "TCN Campus"}</p>
                                        <p className="text-[8px] text-white/60 leading-tight max-w-[120px]">{campus?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-3 rounded-full bg-[#D9644A]" />
                                    <p className="text-[9px] font-bold text-white leading-none">{time || "9:00 AM"} <span className="text-white/60 font-medium ml-1">Service</span></p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-lg shrink-0 shadow-sm">
                            <QRCodeCanvas value={qrCodeValue || "sample"} size={48} fgColor="#12040b" bgColor="#FFFFFF" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

FlyerRepCross1.displayName = "FlyerRepCross1"
export { FlyerRepCross1 }
