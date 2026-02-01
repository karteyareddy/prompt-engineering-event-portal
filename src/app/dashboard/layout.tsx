import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Profile to get name
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                ClubEvent
                            </Link>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {profile?.role === 'participant' ? 'Participant Portal' : 'Dashboard'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                                Hello, <span className="font-semibold">{profile?.full_name || user.email}</span>
                            </span>
                            <form action={logout}>
                                <button type="submit" className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
