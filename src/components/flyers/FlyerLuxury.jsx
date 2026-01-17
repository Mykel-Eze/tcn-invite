import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerLuxury = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-black text-[#FFD700] relative flex flex-col items-center px-4 py-5 border-4 border-double border-[#FFD700] shadow-2xl overflow-hidden">
            {/* Dramatic Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-[#FFD700] rounded-full blur-[150px] opacity-15" />

            {/* Logo */}
            <div className="z-10 mt-1 shrink-0">
                <img src={icon} alt="Icon" className="w-auto h-7 opacity-90" />
            </div>

            {/* Pastor Image - Premium Frame */}
            <div className="z-10 mt-3 relative shrink-0">
                <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-2xl opacity-30 scale-125" />
                <div className="relative p-[3px] bg-gradient-to-br from-[#FFD700] via-yellow-500 to-[#FFD700] rounded-full">
                    <div className="p-[2px] bg-black rounded-full">
                        <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-[#FFD700]/50 shadow-[0_0_40px_rgba(255,215,0,0.4)]">
                            <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="z-10 text-center mt-3 border-b border-[#FFD700]/30 pb-2 w-full shrink-0">
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/60 mb-0.5">The City Needs You</p>
                <h1 className="text-xl font-serif text-white tracking-wide">INVITATION</h1>
            </div>

            {/* Guest Name - Highlighted */}
            <div className="z-10 my-3 relative shrink-0">
                <div className="absolute -inset-2 bg-[#FFD700] blur-lg opacity-20 rounded-lg" />
                <h2 className="relative text-lg font-bold text-white uppercase tracking-wider px-4 truncate max-w-[250px]">
                    {guestName || "Guest"}
                </h2>
            </div>

            {/* Event Details */}
            <div className="z-10 mt-auto mb-3 text-center space-y-2 w-full px-4 shrink-0">
                <div>
                    <p className="text-[9px] text-[#FFD700] tracking-wider mb-0.5">DATE & TIME</p>
                    <p className="text-white font-serif text-sm">Sunday • {time || "09:00"}</p>
                </div>

                <div>
                    <p className="text-[9px] text-[#FFD700] tracking-wider mb-0.5">VENUE</p>
                    <p className="text-white font-serif text-xs max-w-[220px] mx-auto leading-tight truncate px-2">{campus?.address || "Location"}</p>
                </div>
            </div>

            {/* QR Code - Double Border */}
            <div className="z-10 border-2 border-[#FFD700] p-1 shrink-0 mb-1">
                <div className="border border-[#FFD700] p-1">
                    <QRCodeCanvas value={qrCodeValue || "sample"} size={45} fgColor="#FFD700" bgColor="#000000" />
                </div>
            </div>
        </div>
    )
})
FlyerLuxury.displayName = "FlyerLuxury"
export { FlyerLuxury }
