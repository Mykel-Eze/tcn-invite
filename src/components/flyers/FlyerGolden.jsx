import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_icon.png"

const FlyerGolden = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-gradient-to-b from-[#1a1a1a] to-black text-white relative flex flex-col items-center justify-center p-8 border border-[var(--color-highlight)]/30 shadow-2xl">
            {/* Decorative Borders */}
            <div className="absolute inset-2 border border-[var(--color-highlight)]/20 pointer-events-none" />
            <div className="absolute inset-2 border-t border-b border-[var(--color-highlight)]/50 scale-x-75 bg-transparent" />

            {/* Content */}
            <div className="space-y-6 text-center z-10 flex flex-col items-center">
                <img src={icon} alt="Icon" className="w-10 h-10 mb-2 opacity-90" />
                <div>
                    <h1 className="text-3xl font-serif tracking-wider text-[var(--color-highlight)]">INVITATION</h1>
                    <div className="w-12 h-[1px] bg-[var(--color-highlight)] mx-auto mt-2" />
                </div>

                <div>
                    <p className="text-xs tracking-[0.2em] text-gray-400 mb-2 uppercase">Honored Guest</p>
                    <h2 className="text-xl font-medium text-white font-serif italic text-pretty">
                        {guestName || "Guest Name"}
                    </h2>
                </div>

                <div className="space-y-1">
                    <p className="text-[var(--color-highlight)] text-sm font-serif">Join us at</p>
                    <p className="text-lg font-bold">{campus?.name || "TCN Campus"}</p>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">{campus?.address || "Address Here"}</p>
                </div>

                <div className="inline-block px-6 py-1 border border-[var(--color-highlight)] rounded-full text-[var(--color-highlight)] text-sm">
                    {time || "9:00 AM"}
                </div>
            </div>

            <div className="mt-8 bg-white/90 p-3 rounded-none rotate-45 border-4 border-[var(--color-highlight)]/50 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="-rotate-45">
                    <QRCodeCanvas value={qrCodeValue || "sample"} size={70} />
                </div>
            </div>
        </div>
    )
})
FlyerGolden.displayName = "FlyerGolden"
export { FlyerGolden }
