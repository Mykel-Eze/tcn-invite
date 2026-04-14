import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import backgroundImage from "../../assets/images/rep_the_cross.jpeg"
import churchLogo from "../../assets/images/tcn_logo_white.png"

const FlyerRepCross2 = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-[#1a0510] relative flex flex-col shadow-2xl overflow-hidden font-sans text-white">
            {/* --- FILTERED BACKGROUND --- */}
            <div className="absolute inset-0">
                {/* Image converted to grayscale with red blend mode */}
                <img src={backgroundImage} alt="Rep the Cross Background" className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-60" />
                <div className="absolute inset-0 bg-[#A62957] mix-blend-color opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12040b] via-[#12040b]/30 to-transparent" />
            </div>

            {/* --- TOP SECTION: BRANDING --- */}
            <div className="pt-6 px-6 z-10 flex flex-col items-center">
                <img src={churchLogo} alt="The Covenant Nation" className="w-[100px] h-auto object-contain drop-shadow-md opacity-90" />
            </div>

            {/* --- MIDDLE: SPACING FOR BACKGROUND --- */}
            <div className="relative z-10 flex-1">
                 {/* Empty space to show off the filtered background */}
            </div>

            {/* --- BOTTOM: TITLE & GUEST DETAILS --- */}
            <div className="px-5 pb-5 flex flex-col justify-end z-10">
                {/* Event Title Typography */}
                <div className="w-full flex flex-col items-center justify-center relative mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-[1px] w-8 bg-[#D9644A]" />
                        <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#D9644A] text-center drop-shadow-md">
                            Special Service
                        </p>
                        <div className="h-[1px] w-8 bg-[#D9644A]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-widest text-[#fff] drop-shadow-[0_4px_10px_rgba(166,41,87,0.8)] leading-none text-center">
                        REP THE
                    </h1>
                    <h1 className="text-[3.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] leading-[0.8] text-center mt-[-2px]">
                        CROSS
                    </h1>
                </div>

                <div className="border-t border-white/20 pt-3 flex flex-col gap-2">
                    <div className="text-center mb-1">
                        <p className="text-[8px] text-gray-400 font-medium uppercase tracking-[0.2em]">Prepared For</p>
                        <h2 className="text-lg font-bold text-white truncate px-2">{guestName || "Special Guest"}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-start gap-2">
                                <div className="mt-1 w-1 h-1 rounded-sm bg-[#D9644A] shrink-0" />
                                <div>
                                    <p className="text-[9px] font-bold leading-none mb-0.5 truncate uppercase tracking-wider">{campus?.name || "TCN Campus"}</p>
                                    <p className="text-[8px] text-gray-400 leading-tight">{campus?.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-sm bg-[#BF3978] shrink-0" />
                                <p className="text-[9px] font-bold leading-none uppercase tracking-wider">{time || "9:00 AM"}</p>
                            </div>
                        </div>

                        {/* Minimal QR Area */}
                        <div className="bg-white/10 p-1 rounded backdrop-blur-sm shadow-sm shrink-0">
                            <QRCodeCanvas value={qrCodeValue || "sample"} size={45} fgColor="#FFFFFF" bgColor="transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

FlyerRepCross2.displayName = "FlyerRepCross2"
export { FlyerRepCross2 }
