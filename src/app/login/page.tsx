'use client'

import { login } from '../auth/actions'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Hyperspeed from '@/components/Hyperspeed'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const res = await login(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative selection:bg-primary/30">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <Hyperspeed
                    effectOptions={{
                        distortion: "turbulentDistortion",
                        length: 400,
                        roadWidth: 10,
                        islandWidth: 2,
                        lanesPerRoad: 3,
                        fov: 90,
                        fovSpeedUp: 150,
                        speedUp: 2,
                        carLightsFade: 0.4,
                        totalSideLightSticks: 20,
                        lightPairsPerRoadWay: 40,
                        shoulderLinesWidthPercentage: 0.05,
                        brokenLinesWidthPercentage: 0.1,
                        brokenLinesLengthPercentage: 0.5,
                        lightStickWidth: [0.12, 0.5],
                        lightStickHeight: [1.3, 1.7],
                        movingAwaySpeed: [60, 80],
                        movingCloserSpeed: [-120, -160],
                        carLightsLength: [400 * 0.03, 400 * 0.2],
                        carLightsRadius: [0.05, 0.14],
                        carWidthPercentage: [0.3, 0.5],
                        carShiftX: [-0.8, 0.8],
                        carFloorSeparation: [0, 5],
                        colors: {
                            roadColor: 0x080808,
                            islandColor: 0x0a0a0a,
                            background: 0x000000,
                            shoulderLines: 0x131318,
                            brokenLines: 0x131318,
                            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                            sticks: 0x03b3c3
                        }
                    }}
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-20 max-w-md w-full bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-pulse tracking-tight mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-400 font-light tracking-wide">
                        Sign in to access your event dashboard
                    </p>
                </div>

                <div className="space-y-5">
                    <button
                        type="button"
                        onClick={async () => {
                            const supabase = createClient()
                            await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: { redirectTo: `${window.location.origin}/auth/callback` },
                            })
                        }}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-white/10 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
                    >
                        <svg className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-3 bg-black/40 backdrop-blur-xl text-gray-500 font-mono tracking-widest">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all hover:bg-white/10"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all hover:bg-white/10"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/20 p-3 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center text-sm pt-2">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href="/register" className="font-semibold text-primary hover:text-secondary transition-colors inline-flex items-center gap-1 group">
                            Register here
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-secondary"></span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
