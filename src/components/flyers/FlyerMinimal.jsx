import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import icon from "../../assets/images/tcn_logo_black.png"

const FlyerMinimal = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-white text-black relative flex flex-col p-8 shadow-2xl">
            {/* Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black" />
            <div className="absolute right-0 top-0 w-16 h-16 bg-[var(--color-accent)] opacity-10 rounded-bl-[100px]" />

            <div className="flex-1 flex flex-col justify-start space-y-8 pt-8 pl-4 z-10">
                <div className="absolute top-8 right-8">
                    <img src={icon} alt="Icon" className="w-auto h-8 opacity-70" />
                </div>
                <div>
                    <h1 className="text-5xl font-bold tracking-tighter leading-none text-black">
                        SUN<br />DAY
                    </h1>
                    <p className="text-[var(--color-accent)] font-bold tracking-widest text-xs mt-2 uppercase">Service Invitation</p>
                </div>

                <div className="border-l-2 border-black pl-4">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-1">Guest</p>
                    <p className="text-xl font-bold">{guestName || "Guest Name"}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500">Where</p>
                        <p className="font-semibold text-sm">{campus?.name || "TCN Campus"}</p>
                        <p className="text-xs text-gray-600 leading-tight mt-1">{campus?.address || "Address Here"}</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500">When</p>
                        <p className="font-semibold text-sm">{time || "9:00 AM"}</p>
                    </div>
                </div>
            </div>

            <div className="self-end mt-auto bg-black p-2">
                <QRCodeCanvas value={qrCodeValue || "sample"} size={60} fgColor="#FFFFFF" bgColor="#000000" />
            </div>
        </div>
    )
})
FlyerMinimal.displayName = "FlyerMinimal"
export { FlyerMinimal }
