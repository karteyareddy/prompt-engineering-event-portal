'use client'

import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useState, useRef } from 'react'
import { processScan } from './actions'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Camera, Image as ImageIcon } from 'lucide-react'

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err))
            }
        }
    }, [])

    async function startScanner() {
        try {
            setIsScanning(true)
            setError(null)

            // Allow time for DOM to render
            await new Promise(r => setTimeout(r, 100))

            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("reader")
            }

            await scannerRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    onScanSuccess(decodedText)
                },
                (errorMessage) => {
                    // ignore frame parse errors
                }
            )
        } catch (err: any) {
            console.error("Error starting scanner", err)
            // Try fallback: any camera
            try {
                if (scannerRef.current) {
                    await scannerRef.current.start(
                        { facingMode: "user" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (decodedText) => onScanSuccess(decodedText),
                        () => { }
                    )
                }
            } catch (fallbackErr: any) {
                setError(`Mobile Camera Error: ${err?.message || err}. Fallback failed: ${fallbackErr?.message}`)
                setIsScanning(false)
            }
        }
    }

    async function stopScanner() {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
                setIsScanning(false)
            } catch (err) {
                console.error("Failed to stop scanner", err)
            }
        }
    }

    // File scan method as backup
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader")
        }

        scannerRef.current.scanFileV2(file, true)
            .then(decodedText => {
                onScanSuccess(decodedText.decodedText)
            })
            .catch(err => {
                setError(`File Scan Error: ${err}`)
            })
    }


    function onScanSuccess(decodedText: string) {
        console.log(`Code matched = ${decodedText}`)
        // Stop scanning immediately on success
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                setIsScanning(false)
                handleScan(decodedText)
            }).catch(() => {
                setIsScanning(false)
                handleScan(decodedText)
            })
        } else {
            setIsScanning(false)
            handleScan(decodedText)
        }
    }

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
        setIsScanning(false)
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
            <Link href="/admin/dashboard" className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 z-10">
                <ArrowLeft className="w-6 h-6" />
            </Link>

            <h1 className="text-2xl font-bold mb-8">Scan Attendance</h1>

            <div id="reader" className="w-full max-w-sm rounded-2xl overflow-hidden bg-black mb-6"></div>

            {!isScanning && !scanResult && (
                <div className="text-center space-y-4 w-full max-w-sm">
                    <button
                        onClick={startScanner}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                        <Camera className="w-6 h-6" />
                        Start Camera
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-black text-gray-500">OR</span></div>
                    </div>

                    <label className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        <ImageIcon className="w-6 h-6" />
                        Upload QR Image
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    {error && <p className="text-red-500 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">{error}</p>}
                </div>
            )}

            {isScanning && (
                <button
                    onClick={stopScanner}
                    className="mt-4 px-6 py-2 bg-red-600 rounded-full font-bold"
                >
                    Stop Camera
                </button>
            )}

            {scanResult && (
                <div className="text-center space-y-6 max-w-sm w-full">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${scanResult.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {scanResult.success ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                    </div>

                    <h2 className="text-2xl font-bold">{scanResult.message}</h2>

                    {scanResult.team && (
                        <div className="bg-gray-800 p-6 rounded-xl text-left">
                            <p className="text-gray-400 text-sm">Team</p>
                            <p className="text-xl font-bold">{scanResult.team.name}</p>

                            {scanResult.team.profiles && (
                                <p className="text-blue-400 mt-2">Leader: {scanResult.team.profiles.full_name}</p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={resetScanner}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg"
                    >
                        Scan Next
                    </button>
                </div>
            )}
        </div>
    )
}
