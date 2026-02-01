'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { PlusCircle, QrCode, Clock, CheckCircle, XCircle, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { deleteTeam } from './actions'
import { motion } from 'framer-motion'

import Hyperspeed from '@/components/Hyperspeed'

export default function DashboardPage() {
    const [team, setTeam] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function getData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // If Admin or Kiosk, redirect
            if (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin') {
                router.push('/admin/dashboard')
                return
            }

            // Fetch team AND members in one go with a join query
            const { data: team } = await supabase
                .from('teams')
                .select('*, team_members(*)')
                .eq('leader_id', user.id)
                .single()

            setTeam(team)
            setLoading(false)
        }
        getData()
    }, [router, supabase])

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete your team registration? This action cannot be undone.')) return

        setDeleting(true)
        const res = await deleteTeam(team.id)
        if (res?.error) {
            alert(res.error)
            setDeleting(false)
        } else {
            // Refresh page
            window.location.reload()
        }
    }

    if (loading) return <div className="p-8">Loading dashboard...</div>

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-black overflow-hidden relative selection:bg-primary/30">
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
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8 relative z-20 container mx-auto px-4 py-8"
            >
                {/* Header */}
                <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="mt-1 text-gray-400">Manage your registration and team status</p>
                    </div>
                    {team && team.status === 'pending' && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-sm text-red-400 hover:text-red-300 font-medium px-4 py-2 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 w-full md:w-auto text-center border border-red-900/30"
                        >
                            {deleting ? 'Deleting...' : 'Delete Registration'}
                        </button>
                    )}
                </motion.div>

                {/* Status Card */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Registration Status */}
                    <motion.div variants={item} className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Status</h3>
                        <div className="mt-4 flex items-center gap-3">
                            {team ? (
                                <>
                                    {team.status === 'approved' && <CheckCircle className="w-8 h-8 text-green-500" />}
                                    {team.status === 'pending' && <Clock className="w-8 h-8 text-yellow-500" />}
                                    {team.status === 'rejected' && <XCircle className="w-8 h-8 text-red-500" />}
                                    <span className={`text-2xl font-bold capitalize ${team.status === 'approved' ? 'text-green-500' :
                                        team.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                                        }`}>
                                        {team.status}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>
                                    <span className="text-2xl font-bold text-gray-400">Not Registered</span>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Team Info */}
                    <motion.div variants={item} className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Team</h3>
                        <div className="mt-4">
                            {team ? (
                                <div className="flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="text-xl font-bold text-white">{team.name}</p>
                                        <p className="text-sm text-gray-500">ID: {team.qr_code?.substring(0, 8)}...</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No team created yet</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Actions */}
                {!team ? (
                    <motion.div variants={item} className="bg-blue-900/20 border border-blue-800 rounded-2xl p-8 text-center space-y-4 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white">Ready to join?</h2>
                        <p className="text-gray-300 max-w-lg mx-auto">
                            Create your team, add members, and upload your payment proof to complete registration.
                        </p>
                        <Link href="/dashboard/create-team" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                            <PlusCircle className="w-5 h-5" />
                            Create Team
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* QR Code Section (Only if approved) */}
                        {team.status === 'approved' ? (
                            <motion.div variants={item} className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10 text-center">
                                <h3 className="text-lg font-bold mb-4 text-white">Your Event Pass</h3>
                                <div className="bg-white p-4 inline-block rounded-xl border-2 border-gray-900">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${team.qr_code_value || team.id}`}
                                        alt="Team QR Code"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-gray-400">Show this QR code at the entrance.</p>
                                <p className="text-xs text-gray-500 mt-2">Do not share this with others.</p>
                            </motion.div>
                        ) : (
                            <motion.div variants={item} className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-dashed border-gray-700 text-center flex flex-col items-center justify-center h-full">
                                <QrCode className="w-12 h-12 text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-300">QR Code Locked</h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    Your QR code will be generated once your registration is approved by the admin.
                                </p>
                            </motion.div>
                        )}

                        {/* Team Details View */}
                        <motion.div variants={item} className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                            <h3 className="text-lg font-bold mb-4 text-white">Team Details</h3>
                            <TeamMembersList members={team.team_members} />
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function TeamMembersList({ members }: { members: any[] }) {
    if (!members || members.length === 0) return <p className="text-gray-500">No members added.</p>

    return (
        <ul className="space-y-3">
            {members.map((member) => (
                <li key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800">
                        {member.photo_url ? (
                            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        {member.reg_no && <p className="text-xs text-gray-500 font-mono">{member.reg_no}</p>}
                    </div>
                </li>
            ))}
        </ul>
    )
}
