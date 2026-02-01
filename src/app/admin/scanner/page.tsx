'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import { processScan } from './actions'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [isScanning, setIsScanning] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Only init scanner if we are scanning
        if (!isScanning) return

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        )

        scanner.render(onScanSuccess, onScanFailure)

        function onScanSuccess(decodedText: string, decodedResult: any) {
            // Handle the scanned code
            console.log(`Code matched = ${decodedText}`, decodedResult)
            handleScan(decodedText)
            scanner.clear()
            setIsScanning(false)
        }

        function onScanFailure(error: any) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err))
        }
    }, [isScanning])

    async function handleScan(qrCode: string) {
        setError(null)
        try {
            const result = await processScan(qrCode)
            setScanResult(result)
        } catch (err) {
            setError("Failed to process scan")
        }
    }

    function resetScanner() {
        setScanResult(null)
        setError(null)
        setIsScanning(true)
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
            <Link href="/admin/dashboard" className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <h1 className="text-2xl font-bold mb-8">Scan Attendance</h1>

            {isScanning && (
                <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div id="reader"></div>
                </div>
            )}

            {!isScanning && scanResult && (
                <div className="text-center space-y-6 max-w-sm">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${scanResult.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {scanResult.success ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                    </div>

                    <h2 className="text-3xl font-bold">{scanResult.message}</h2>

                    {scanResult.team && (
                        <div className="bg-gray-800 p-6 rounded-xl">
                            <p className="text-gray-400 text-sm">Team</p>
                            <p className="text-xl font-bold">{scanResult.team.name}</p>

                            {scanResult.team.profiles && (
                                <p className="text-blue-400 mt-2">Leader: {scanResult.team.profiles.full_name}</p>
                            )}

                            <p className="text-gray-500 text-xs mt-4">ID: {scanResult.team.id}</p>
                        </div>
                    )}

                    <button
                        onClick={resetScanner}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition-colors"
                    >
                        Scan Next
                    </button>
                </div>
            )}

            {!isScanning && error && (
                <div className="text-center space-y-6 max-w-sm">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button onClick={resetScanner} className="px-6 py-2 bg-white text-black rounded-full font-bold">Try Again</button>
                </div>
            )}

        </div>
    )
}
