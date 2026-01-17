import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"

const FlyerGradient = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative flex flex-col items-center p-6 shadow-2xl overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            {/* Icon */}
            <div className="z-10 mt-4 mb-4">
                <img src={icon} alt="Icon" className="w-auto h-12 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            </div>

            <div className="z-10 text-center space-y-2 flex-1 flex flex-col justify-center">
                <h3 className="text-yellow-400 tracking-[0.3em] text-xs font-bold uppercase">Exclusive Invite</h3>
                <h1 className="text-4xl font-bold font-serif text-white drop-shadow-md">
                    SUNDAY<br />SERVICE
                </h1>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-4" />

                <p className="text-gray-300 text-sm">Welcome</p>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
                    {guestName || "Guest Name"}
                </h2>
            </div>

            {/* Info Box */}
            <div className="z-10 w-full glass-panel bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6 text-center space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs text-gray-300 uppercase">Where</span>
                    <span className="font-semibold text-sm">{campus?.name || "Campus"}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-300 uppercase">When</span>
                    <span className="font-semibold text-sm">{time || "9:00 AM"}</span>
                </div>
            </div>

            <div className="z-10 bg-white p-2 rounded-lg">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={64} />
            </div>
        </div>
    )
})
FlyerGradient.displayName = "FlyerGradient"
export { FlyerGradient }
