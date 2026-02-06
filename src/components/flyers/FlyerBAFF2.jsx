import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import eventTitleImage from "../../assets/images/KindRED-Connect-Logo.png"
import churchLogo from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerBAFF2 = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    // Palette: #A62957, #BF3978, #732758, #D9644A, #BF3B3B

    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-[#12040b] text-white relative flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#732758] rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#D9644A] rounded-full blur-[80px] opacity-15 pointer-events-none" />

            {/* --- HEADER --- */}
            <div className="px-5 pt-5 pb-2 flex justify-between items-center z-10 shrink-0">
                <img src={churchLogo} alt="TCN" className="h-5 w-auto opacity-90" />
                <span className="text-[9px] tracking-widest uppercase font-bold text-[#D9644A]">BAFF Sunday</span>
            </div>

            {/* --- HERO / LOGO --- */}
            <div className="px-5 py-2 flex flex-col items-center z-10 shrink-0">
                <img src={eventTitleImage} alt="KindRED Connect" className="w-[150px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-3" />

                {/* Pastor Circle */}
                <div className="relative w-24 h-24 rounded-full border-2 border-[#BF3978] p-1 shadow-[0_0_20px_rgba(166,41,87,0.4)]">
                    <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover rounded-full bg-[#2a0815]" />
                    <div className="absolute -bottom-2 inset-x-0 text-center">
                        <span className="bg-[#D9644A] text-[8px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm border border-[#12040b]">
                            Pst. Poju
                        </span>
                    </div>
                </div>
            </div>

            {/* --- INVITE DETAILS --- */}
            <div className="flex-1 px-4 pb-4 flex flex-col justify-end z-10 min-h-0">
                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col relative">
                    {/* Guest Header */}
                    <div className="text-center border-b border-white/10 pb-2 mb-2">
                        <p className="text-[9px] text-gray-400 font-medium mb-0.5">Prepared exclusively for</p>
                        <h2 className="text-lg font-bold text-white truncate px-2">{guestName || "Special Guest"}</h2>
                    </div>

                    {/* Lower Grid: Info + QR */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2 min-w-0">
                            {/* Location */}
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 w-1 h-1 rounded-full bg-[#D9644A] shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold leading-none mb-0.5 truncate">{campus?.name || "TCN Campus"}</p>
                                    <p className="text-[9px] text-gray-400 leading-tight truncate">{campus?.address}</p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#BF3978] shrink-0" />
                                <p className="text-[10px] font-bold leading-none">{time || "9:00 AM"}</p>
                            </div>
                        </div>

                        {/* Qr Code */}
                        <div className="bg-white p-1 rounded shrink-0">
                            <QRCodeCanvas value={qrCodeValue || "sample"} size={48} fgColor="#12040b" bgColor="#FFFFFF" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[#A62957] via-[#BF3978] to-[#732758]" />
        </div>
    )
})

FlyerBAFF2.displayName = "FlyerBAFF2"
export { FlyerBAFF2 }
