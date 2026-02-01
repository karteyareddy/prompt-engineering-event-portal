'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTeamStatus(formData: FormData) {
    const supabase = await createClient()

    // Verify Admin (basic check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !['admin', 'super_admin'].includes(user.user_metadata?.role)) {
        // throw new Error('Unauthorized')
        return // silently fail or log server side
    }

    const teamId = formData.get('teamId') as string
    const status = formData.get('status') as string

    if (!teamId || !status) return

    // Init update object
    const updates: any = { status }

    // If approving, generate QR Code if not exists
    if (status === 'approved') {
        updates.qr_code = teamId
    }

    const { error } = await supabase.from('teams').update(updates).eq('id', teamId)

    if (error) {
        console.error('Update failed:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin/dashboard')
}
