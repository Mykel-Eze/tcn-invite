import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerModern = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white relative flex flex-col items-center px-4 py-5 overflow-hidden shadow-2xl">
            {/* Background Glow Effects */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--color-accent)] rounded-full blur-[100px] opacity-30" />
            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-[var(--color-highlight)] rounded-full blur-[100px] opacity-20" />

            {/* Logo */}
            <div className="z-10 relative shrink-0">
                <img src={icon} alt="Icon" className="w-auto h-6 opacity-90" />
            </div>

            {/* Pastor Image - Hero Element */}
            <div className="z-10 mt-3 relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-highlight)] rounded-full blur-md opacity-60 scale-110" />
                <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Title */}
            <div className="z-10 text-center mt-3 shrink-0">
                <h3 className="text-[var(--color-accent)] font-bold tracking-[0.3em] text-[10px] uppercase">You Are Invited</h3>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white leading-tight mt-0.5">
                    Sunday Service
                </h1>
            </div>

            {/* Guest Name */}
            <div className="z-10 text-center mt-3 w-full px-2 shrink-0">
                <p className="text-gray-400 text-[10px] mb-0.5">Specially for</p>
                <h2 className="text-lg font-bold text-white truncate border-b border-[var(--color-accent)] inline-block pb-0.5 px-3 max-w-full">
                    {guestName || "Guest Name"}
                </h2>
            </div>

            {/* Details */}
            <div className="z-10 w-full mt-auto mb-3 space-y-2 shrink-0">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-center">
                    <p className="text-[var(--color-accent)] font-bold text-[9px] uppercase tracking-wider">Location</p>
                    <p className="text-[11px] font-semibold mt-0.5 truncate px-1">{campus?.name || "TCN Campus"}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 truncate px-1">{campus?.address || "Address"}</p>
                </div>

                <div className="flex justify-center">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1.5 px-3">
                        <p className="text-[var(--color-accent)] font-bold text-[9px] uppercase tracking-wider">Time</p>
                        <p className="text-[11px] font-semibold mt-0.5">{time || "9:00 AM"}</p>
                    </div>
                </div>
            </div>

            {/* QR Code */}
            <div className="z-10 bg-white p-1 rounded shrink-0">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={50} />
            </div>

            {/* Scan Text */}
            <div className="text-[8px] text-gray-600 z-10 mt-1 shrink-0">Scan at PCU desk</div>
        </div>
    )
})
FlyerModern.displayName = "FlyerModern"
export { FlyerModern }
