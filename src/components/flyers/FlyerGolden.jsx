import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerGolden = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-black text-white relative flex flex-col items-center px-4 py-5 overflow-hidden shadow-2xl">
            {/* Ornate Border Frame */}
            <div className="absolute inset-3 border-2 border-[var(--color-highlight)]/40 pointer-events-none" />
            <div className="absolute inset-4 border border-[var(--color-highlight)]/20 pointer-events-none" />

            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-[var(--color-highlight)]" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[var(--color-highlight)]" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-[var(--color-highlight)]" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-[var(--color-highlight)]" />

            {/* Logo */}
            <div className="z-10 mt-1 shrink-0">
                <img src={icon} alt="Icon" className="w-auto h-6 opacity-90" />
            </div>

            {/* Pastor Image - Elegant Frame */}
            <div className="z-10 mt-2 relative shrink-0">
                <div className="absolute inset-0 bg-[var(--color-highlight)] rounded-full blur-xl opacity-40 scale-125" />
                <div className="relative p-1 bg-gradient-to-br from-[var(--color-highlight)] via-yellow-600 to-[var(--color-highlight)] rounded-full">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-black shadow-2xl">
                        <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <div className="z-10 text-center mt-2 shrink-0">
                <h1 className="text-xl font-serif tracking-wider text-[var(--color-highlight)]">INVITATION</h1>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-highlight)] to-transparent mx-auto mt-1" />
            </div>

            {/* Guest Name */}
            <div className="z-10 text-center mt-2 shrink-0 w-full px-2">
                <p className="text-[9px] tracking-[0.2em] text-gray-400 mb-1 uppercase">Honored Guest</p>
                <h2 className="text-base font-serif italic text-white px-2 truncate w-full">
                    {guestName || "Guest Name"}
                </h2>
            </div>

            {/* Event Details */}
            <div className="z-10 mt-auto mb-3 text-center space-y-2 w-full px-4 shrink-0">
                <div className="border-t border-b border-[var(--color-highlight)]/30 py-2">
                    <p className="text-[var(--color-highlight)] text-[10px] font-serif mb-0.5">Join us at</p>
                    <p className="text-xs font-bold truncate">{campus?.name || "TCN Campus"}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 truncate">{campus?.address || "Address"}</p>
                </div>

                <div className="inline-block px-3 py-1 border border-[var(--color-highlight)] rounded-full">
                    <p className="text-[var(--color-highlight)] text-[10px] font-semibold">{time || "9:00 AM"}</p>
                </div>
            </div>

            {/* QR Code */}
            <div className="z-10 bg-white/95 p-1.5 rotate-45 border border-[var(--color-highlight)]/60 shadow-[0_0_20px_rgba(255,215,0,0.3)] mb-2 shrink-0">
                <div className="-rotate-45">
                    <QRCodeCanvas value={qrCodeValue || "sample"} size={45} />
                </div>
            </div>
        </div>
    )
})
FlyerGolden.displayName = "FlyerGolden"
export { FlyerGolden }
