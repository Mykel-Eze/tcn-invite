import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_black.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerMinimal = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-white text-black relative flex flex-col shadow-2xl overflow-hidden">
            {/* Accent Elements */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black" />
            <div className="absolute right-0 top-0 w-20 h-20 bg-[var(--color-accent)] opacity-15" />

            {/* Logo */}
            <div className="absolute top-4 right-4 z-10">
                <img src={icon} alt="Icon" className="w-auto h-5 opacity-60" />
            </div>

            {/* Pastor Image - Bold Hero */}
            <div className="mt-6 ml-5 z-10">
                <div className="relative w-[130px] h-[130px]">
                    <div className="absolute -inset-2 bg-[var(--color-accent)] opacity-10" />
                    <div className="relative w-full h-full overflow-hidden shadow-2xl">
                        <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black" />
                </div>
            </div>

            {/* Title */}
            <div className="mt-4 ml-5 z-10">
                <h1 className="text-4xl font-black tracking-tighter leading-none text-black">
                    SUN<br />DAY
                </h1>
                <p className="text-[var(--color-accent)] font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">Service Invitation</p>
            </div>

            {/* Guest Name */}
            <div className="mt-4 ml-5 border-l-4 border-black pl-3 z-10 max-w-[160px]">
                <p className="text-[10px] font-bold uppercase text-gray-500 mb-0.5">Guest</p>
                <p className="text-lg font-bold leading-tight truncate">{guestName || "Guest Name"}</p>
            </div>

            {/* Event Details */}
            <div className="mt-auto mb-4 ml-5 space-y-2 z-10 max-w-[160px]">
                <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">Where</p>
                    <p className="font-bold text-xs mt-0.5 truncate">{campus?.name || "TCN Campus"}</p>
                    <p className="text-[10px] text-gray-600 leading-tight mt-0.5 truncate">{campus?.address || "Address"}</p>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase text-gray-500">When</p>
                    <p className="font-bold text-xs mt-0.5">{time || "9:00 AM"}</p>
                </div>
            </div>

            {/* QR Code */}
            <div className="absolute bottom-4 right-4 bg-black p-1.5 z-10">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={45} fgColor="#FFFFFF" bgColor="#000000" />
            </div>
        </div>
    )
})
FlyerMinimal.displayName = "FlyerMinimal"
export { FlyerMinimal }
