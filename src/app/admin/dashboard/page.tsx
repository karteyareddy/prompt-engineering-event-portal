import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QrCode, CheckCircle, XCircle, Clock, Search, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { updateTeamStatus } from '@/app/admin/dashboard/actions'

export default async function AdminDashboardPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()

    // Verify Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const role = user.user_metadata?.role
    if (!['admin', 'super_admin'].includes(role)) {
        redirect('/dashboard')
    }

    const { status } = await searchParams || {}

    let query = supabase.from('teams').select('*, profiles(full_name, username), team_members(name, photo_url)')
    if (status && typeof status === 'string' && status !== 'all') {
        query = query.eq('status', status)
    }

    const { data: teams, error } = await query.order('created_at', { ascending: false })
    if (error) {
        console.error('Error fetching teams:', error)
    }



    // Analytics
    const { count: totalTeams } = await supabase.from('teams').select('*', { count: 'exact', head: true })
    const { count: approvedTeams } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    const { count: pendingTeams } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { count: presentCount } = await supabase.from('attendance_logs').select('*', { count: 'exact', head: true }).eq('status', 'success')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="/api/export/teams" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                                Export CSV
                            </a>
                            <Link href="/admin/scanner" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2">
                                <QrCode className="w-5 h-5" />
                                Scanner Mode
                            </Link>
                            <form action={logout}>
                                <button type="submit" className="p-2 text-gray-400 hover:text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Analytics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500">Total Teams</h3>
                        <p className="text-3xl font-bold mt-2">{totalTeams || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                        <p className="text-3xl font-bold mt-2 text-green-600">{approvedTeams || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                        <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingTeams || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-500">Present</h3>
                        <p className="text-3xl font-bold mt-2 text-blue-600">{presentCount || 0}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    <Link href="/admin/dashboard?status=all" className={`px-4 py-2 rounded-full text-sm font-medium ${!status || status === 'all' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>All</Link>
                    <Link href="/admin/dashboard?status=pending" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>Pending</Link>
                    <Link href="/admin/dashboard?status=approved" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>Approved</Link>
                    <Link href="/admin/dashboard?status=rejected" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>Rejected</Link>
                </div>

                {/* Teams List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {teams?.map((team) => (
                                <tr key={team.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{team.name}</div>
                                        <div className="text-xs text-gray-400">{team.id.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {team.team_members && team.team_members.length > 0 ? (
                                                team.team_members.map((member: any, idx: number) => (
                                                    <div key={idx} className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700" title={member.name}>
                                                        {member.photo_url ? (
                                                            <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full w-full text-xs font-medium text-gray-500">
                                                                {member.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">No members</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {team.team_members && team.team_members.length > 0 ? team.team_members[0].name : team.profiles?.full_name}
                                        </div>
                                        <div className="text-xs text-gray-500">{team.profiles?.username} (Registered by)</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={team.payment_proof_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                            View Proof
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${team.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                team.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {team.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <form action={updateTeamStatus}>
                                                <input type="hidden" name="teamId" value={team.id} />
                                                <input type="hidden" name="status" value="approved" />
                                                <button type="submit" disabled={team.status === 'approved'} className="text-green-600 hover:text-green-900 disabled:opacity-30 disabled:cursor-not-allowed" title="Approve">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                            <form action={updateTeamStatus}>
                                                <input type="hidden" name="teamId" value={team.id} />
                                                <input type="hidden" name="status" value="rejected" />
                                                <button type="submit" disabled={team.status === 'rejected'} className="text-red-600 hover:text-red-900 disabled:opacity-30 disabled:cursor-not-allowed" title="Reject">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}
