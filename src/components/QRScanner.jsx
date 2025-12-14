/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from './ui/Button'

export function QRScanner({ onScan, onError }) {
    const scannerRef = useRef(null)
    const [ scanning, setScanning ] = useState(true)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        )

        scanner.render(
            (decodedText) => {
                onScan(decodedText)
                scanner.clear()
                setScanning(false)
            },
            (errorMessage) => {
                console.error(errorMessage) 
                // ignore errors during scanning
            }
        )

        scannerRef.current = scanner

        // Cleanup
        return () => {
            try {
                if (scannerRef.current) scannerRef.current.clear()
            } catch (e) {
                console.error('Error clearing QR scanner:', e)
                // ignore cleanup errors
            }
        }
    }, [ onScan ])

    return (
        <div className="w-full max-w-sm mx-auto">
            <div id="reader" className="w-full bg-black rounded-lg overflow-hidden border border-white/20" />
            {!scanning && (
                <div className="text-center mt-4">
                    <Button onClick={() => window.location.reload()}>Scan Another</Button>
                </div>
            )}
        </div>
    )
}
