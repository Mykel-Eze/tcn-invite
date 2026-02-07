import React from "react"
import { QRCodeCanvas } from "qrcode.react"
import eventTitleImage from "../../assets/images/KindRED-Connect-Logo.png"
import churchLogo from "../../assets/images/tcn_logo_white.png"
import pastorImage from "../../assets/images/pastor_poju.png"

const FlyerBAFF1 = React.forwardRef(({ guestName, campus, time, qrCodeValue }, ref) => {
    // Palette: #A62957, #BF3978, #732758, #D9644A, #BF3B3B

    return (
        <div ref={ref} className="w-[300px] h-[500px] bg-[#732758] relative flex flex-col shadow-2xl overflow-hidden font-sans text-white">
            {/* --- RICH BACKGROUND --- */}
            {/* Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A62957] via-[#732758] to-[#2a0815]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#BF3978] rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9644A] rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

            {/* --- TOP SECTION: BRANDING --- */}
            <div className="pt-4 px-6 pb-2 z-10 flex flex-col items-center">
                {/* Church Logo - LARGER as requested */}
                <img src={churchLogo} alt="The Covenant Nation" className="w-[120px] h-auto object-contain mb-4 drop-shadow-md opacity-95" />

                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#fff] mt-3 mb-1 text-center">
                    You are specially invited to
                </p>

                {/* Event Title */}
                <div className="w-full flex justify-center relative my-[-10px]">
                    <div className="absolute inset-0 bg-white blur-xl opacity-10 rounded-full" />
                    <img src={eventTitleImage} alt="KindRED Connect" className="w-[160px] h-auto object-contain relative z-10 drop-shadow-lg" />
                </div>

                {/* <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D9644A] my-3 text-center">
                    Connect &middot; Engage &middot; Grow
                </p> */}
            </div>

            {/* --- MIDDLE: PASTOR --- */}
            <div className="relative z-10 flex justify-center -mt-2">
                {/* Pastor Circle */}
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-[#D9644A] to-[#A62957] shadow-lg relative mt-2">
                    {/* Ministering Badge */}
                    <div className="absolute -top-3 inset-x-0 flex justify-center z-20">
                        <span className="bg-[#1a0510] text-white text-[7px] font-bold uppercase py-0.5 px-2 rounded-full border border-[#D9644A]/50 shadow-md tracking-wider">
                            Ministering
                        </span>
                    </div>

                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#1a0510] relative z-10">
                        <img src={pastorImage} alt="Pastor Poju" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center z-20">
                        <span className="bg-[#1a0510] text-[#D9644A] text-[7px] font-bold uppercase py-0.5 px-2 rounded-full border border-[#D9644A]/30">
                            Pst.&nbsp;Poju&nbsp;Oyemade
                        </span>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: GUEST CARD (Glassmorphism) --- */}
            <div className="flex-1 p-3 flex flex-col justify-end z-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl relative overflow-hidden group">
                    {/* Hover Shine Effect */}
                    <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 opacity-50" />

                    <div className="flex gap-3 items-end">
                        <div className="flex-1 min-w-0">
                            <p className="text-[8px] text-[#D9644A] font-bold uppercase mb-0.5 tracking-wider">Join us this Sunday, Feb 15</p>
                            <h2 className="text-lg font-black leading-none truncate text-white mb-2">{guestName || "Special Guest"}</h2>

                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-3 rounded-full bg-[#BF3978]" />
                                    <div>
                                        <p className="text-[9px] font-bold text-white leading-none">{campus?.name || "TCN Campus"}</p>
                                        <p className="text-[8px] text-white/60 leading-tight max-w-[120px]">{campus?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-3 rounded-full bg-[#D9644A]" />
                                    <p className="text-[9px] font-bold text-white leading-none">{time || "9:00 AM"} <span className="text-white/60 font-medium ml-1">Sunday Service</span></p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-lg shrink-0 shadow-sm">
                            <QRCodeCanvas value={qrCodeValue || "sample"} size={48} fgColor="#2a0815" bgColor="#FFFFFF" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

FlyerBAFF1.displayName = "FlyerBAFF1"
export { FlyerBAFF1 }
