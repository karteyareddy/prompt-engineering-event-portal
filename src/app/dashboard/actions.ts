'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteTeam(teamId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Verify ownership before deleting
    const { data: team } = await supabase.from('teams').select('id, leader_id').eq('id', teamId).single()

    if (!team) {
        return { error: 'Team not found' }
    }

    if (team.leader_id !== user.id) {
        return { error: 'You are not authorized to delete this team' }
    }

    const { error } = await supabase.from('teams').delete().eq('id', teamId)

    if (error) {
        return { error: `Failed to delete team: ${error.message}` }
    }

    revalidatePath('/dashboard')
    revalidatePath('/admin/dashboard')

    // We return success, the client should reload or validatet
    return { success: true }
}
