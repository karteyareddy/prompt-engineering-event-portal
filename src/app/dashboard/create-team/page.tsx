'use client'

import { createTeam } from '@/app/dashboard/create-team/actions'
import { useState } from 'react'
import { Plus, Trash2, UploadCloud, Shield, Users, CreditCard, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CreateTeamPage() {
    const [members, setMembers] = useState<{ name: string, regNo: string, photo: File | null }[]>([{ name: '', regNo: '', photo: null }])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [fileName, setFileName] = useState<string | null>(null)

    const router = useRouter()

    function addMember() {
        if (members.length < 5) {
            setMembers([...members, { name: '', regNo: '', photo: null }])
        }
    }

    function removeMember(index: number) {
        setMembers(members.filter((_, i) => i !== index))
    }

    function updateMemberName(index: number, name: string) {
        const newMembers = [...members]
        newMembers[index].name = name
        setMembers(newMembers)
    }

    function updateMemberRegNo(index: number, regNo: string) {
        const newMembers = [...members]
        newMembers[index].regNo = regNo
        setMembers(newMembers)
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        } else {
            setFileName(null)
        }
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        console.log("Client Submitting...", Object.fromEntries(formData))

        try {
            const res = await createTeam(formData)
            if (res?.error) {
                setError(res.error)
                setLoading(false)
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            console.error("Submission Error", err);
            setError("An unexpected error occurred")
            setLoading(false)
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Register Your Team</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Complete the form below to get started.</p>
            </motion.div>

            <motion.form
                onSubmit={onSubmit}
                className="space-y-8"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Team Info */}
                <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold">Team Information</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                        <input name="teamName" type="text" required className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. The Avengers" />
                    </div>
                </motion.div>

                {/* Member Info */}
                <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-xl font-bold">Team Members ({members.length}/5)</h2>
                            {members.length < 5 && (
                                <button type="button" onClick={addMember} className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add Member
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input type="hidden" name="memberCount" value={members.length} />
                        {members.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            name={`member_${index}_name`}
                                            type="text"
                                            required
                                            placeholder="Member Name"
                                            value={member.name}
                                            onChange={(e) => updateMemberName(index, e.target.value)}
                                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2"
                                        />
                                        <input
                                            name={`member_${index}_reg_no`}
                                            type="text"
                                            required
                                            placeholder="Reg No"
                                            value={member.regNo}
                                            onChange={(e) => updateMemberRegNo(index, e.target.value)}
                                            className="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Member Photo (Optional)</label>
                                        <input
                                            name={`member_${index}_photo`}
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                                {index > 0 && (
                                    <button type="button" onClick={() => removeMember(index)} className="p-2 text-red-500 hover:bg-red-50 rounded mt-1">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Payment Proof File */}
                <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold">Payment Proof</h2>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="paymentProof" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    {fileName ? <span className="text-green-500 font-bold">{fileName}</span> : <><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</>}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF</p>
                            </div>
                            <input id="paymentProof" name="paymentProof" type="file" className="hidden" required accept="image/*,application/pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        If image is not uploading you can upload in drive with this link <a href="https://drive.google.com/drive/folders/1lWaxaIVCPYdBltcHHvCfZ4O0mEoRCecI" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Click Here</a>
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-500 text-sm bg-red-50 p-2 rounded"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.div variants={item} className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Uploading...' : 'Submit Registration'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </motion.div>
            </motion.form>
        </div>
    )
}
