import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_white.png"

const FlyerModern = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-black text-white relative flex flex-col items-center justify-between p-6 overflow-hidden border border-white/10 shadow-2xl">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--color-accent)] rounded-full blur-[80px] opacity-40 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[var(--color-highlight)] rounded-full blur-[80px] opacity-20 -translate-x-1/2 translate-y-1/4" />

            {/* Header */}
            <div className="z-10 text-center space-y-2 mt-8 flex flex-col items-center">
                <img src={icon} alt="Icon" className="w-auto h-8 mb-2" />
                <h3 className="text-[var(--color-accent)] font-bold tracking-widest text-sm uppercase">You Are Invited</h3>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Sunday Service
                </h1>
            </div>

            {/* Guest Info */}
            <div className="z-10 text-center w-full">
                <p className="text-gray-400 text-sm mb-1">Specially for</p>
                <h2 className="text-2xl font-semibold text-white truncate px-2 border-b border-[var(--color-accent)] inline-block pb-1">
                    {guestName || "Guest Name"}
                </h2>
            </div>

            {/* Details */}
            <div className="z-10 w-full space-y-4 text-center">
                <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-[var(--color-accent)] font-bold text-xs uppercase">Location</p>
                    <p className="text-sm font-medium">{campus?.name || "TCN Campus"}</p>
                    <p className="text-xs text-gray-400">{campus?.address || "Address Here"}</p>
                </div>

                <div className="flex justify-center gap-4">
                    <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-white/10 min-w-[80px]">
                        <p className="text-[var(--color-accent)] font-bold text-xs uppercase">Time</p>
                        <p className="text-sm font-medium">{time || "9:00 AM"}</p>
                    </div>
                </div>
            </div>

            {/* QR Code */}
            <div className="z-10 bg-white p-2 rounded-lg mb-8">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={80} />
            </div>

            <div className="absolute bottom-2 text-[10px] text-gray-600">Scan at the PCU desk required</div>
        </div>
    )
})
FlyerModern.displayName = "FlyerModern"
export { FlyerModern }
