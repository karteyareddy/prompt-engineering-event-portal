import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch Data
    const { data: teams } = await supabase.from('teams').select('*, profiles!leader_id(full_name, email, username)')

    if (!teams) return new NextResponse('No data', { status: 404 })

    // Convert to CSV
    const headers = ['Team Name', 'Team ID', 'Status', 'Leader Name', 'Leader Email', 'Payment Link', 'Created At']
    const rows = teams.map(team => [
        team.name,
        team.id,
        team.status,
        team.profiles?.full_name || '',
        team.profiles?.email || '',
        team.payment_proof_link || '',
        team.created_at
    ])

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="club-event-teams-${new Date().toISOString().split('T')[0]}.csv"`
        }
    })
}
