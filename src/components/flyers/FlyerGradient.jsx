import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerGradient = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative flex flex-col items-center px-4 py-5 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

            {/* Glow Effects */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-[120px] opacity-20" />

            {/* Logo */}
            <div className="z-10 mt-1 shrink-0">
                <img src={icon} alt="Icon" className="w-auto h-7 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
            </div>

            {/* Pastor Image - Hexagonal Frame */}
            <div className="z-10 mt-3 relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full blur-2xl opacity-50 scale-125" />
                <div className="relative">
                    <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-4 border-yellow-400/60 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                        <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="z-10 text-center mt-3 shrink-0">
                <h3 className="text-yellow-400 tracking-[0.35em] text-[9px] font-bold uppercase">Exclusive Invite</h3>
                <h1 className="text-2xl font-bold font-serif text-white drop-shadow-lg mt-0.5">
                    SUNDAY<br />SERVICE
                </h1>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-3 z-10 shrink-0" />

            {/* Guest Name */}
            <div className="z-10 text-center shrink-0 w-full px-2">
                <p className="text-gray-300 text-[10px] mb-0.5">Welcome</p>
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 px-2 truncate">
                    {guestName || "Guest Name"}
                </h2>
            </div>

            {/* Info Card */}
            <div className="z-10 w-full mt-auto mb-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center space-y-2 shrink-0">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                    <span className="text-[10px] text-gray-300 uppercase tracking-wide">Where</span>
                    <span className="font-semibold text-xs text-right flex-1 ml-2 truncate">{campus?.name || "Campus"}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-300 uppercase tracking-wide">When</span>
                    <span className="font-semibold text-xs">{time || "9:00 AM"}</span>
                </div>
            </div>

            {/* QR Code */}
            <div className="z-10 bg-white p-1.5 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={50} />
            </div>
        </div>
    )
})
FlyerGradient.displayName = "FlyerGradient"
export { FlyerGradient }
