import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"

const FlyerLuxury = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-black text-[#FFD700] relative flex flex-col items-center p-8 border-4 border double border-[#FFD700] shadow-2xl">
            {/* Icon */}
            <div className="absolute top-6">
                <img src={icon} alt="Icon" className="w-auto h-10 opacity-80" />
            </div>

            <div className="mt-16 text-center w-full border-b border-[#FFD700]/30 pb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">The City Needs You</p>
                <h1 className="text-3xl font-serif text-white">INVITATION</h1>
            </div>

            <div className="my-auto text-center space-y-6 w-full">
                <div className="relative">
                    <div className="absolute -inset-1 bg-[#FFD700] blur opacity-20 rounded-lg"></div>
                    <h2 className="relative text-2xl font-bold text-white uppercase tracking-wider">{guestName || "Guest"}</h2>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-[#FFD700]">DATE & TIME</p>
                    <p className="text-white font-serif text-lg">Sunday • {time || "09:00"}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-[#FFD700]">VENUE</p>
                    <p className="text-white font-serif text-sm max-w-[200px] mx-auto">{campus?.address || "Location"}</p>
                </div>
            </div>

            <div className="mt-auto border border-[#FFD700] p-1">
                <div className="border border-[#FFD700] p-1">
                    <QRCodeCanvas value={qrCodeValue || "sample"} size={60} fgColor="#FFD700" bgColor="#000000" />
                </div>
            </div>
        </div>
    )
})
FlyerLuxury.displayName = "FlyerLuxury"
export { FlyerLuxury }
