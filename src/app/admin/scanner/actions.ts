'use server'

import { createClient } from '@/utils/supabase/server'

export async function processScan(qrCode: string) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'Unauthorized' }

    const role = user.user_metadata?.role
    if (!['admin', 'super_admin', 'kiosk'].includes(role)) {
        return { success: false, message: 'Unauthorized' }
    }

    // 1. Find Team by QR
    // Assuming qrCode matches team.qr_code (and it is unique)
    // Or qrCode is just the UUID. 
    // Logic: Look for team with id = qrCode OR qr_code = qrCode

    // UUID validation regex (simple)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(qrCode)

    let query = supabase.from('teams').select('*, profiles!leader_id(*)').single()

    // Assuming we use ID as QR value from dashboard
    if (isUUID) {
        query = supabase.from('teams').select('*, profiles!leader_id(*)').eq('id', qrCode).single()
    } else {
        query = supabase.from('teams').select('*, profiles!leader_id(*)').eq('qr_code', qrCode).single()
    }

    const { data: team, error } = await query

    if (error || !team) {
        return { success: false, message: 'Invalid Ticket' }
    }

    if (team.status !== 'approved') {
        return { success: false, message: 'Registration Not Approved', team }
    }

    // 2. Check for double scan
    const { data: logs } = await supabase.from('attendance_logs').select('*').eq('qr_code_scanned', team.id /* or qr value */).eq('status', 'success')

    if (logs && logs.length > 0) {
        // Log Duplicate attempt
        await supabase.from('attendance_logs').insert({
            qr_code_scanned: team.id,
            scanned_by: user.id,
            status: 'duplicate',
        })
        return { success: false, message: 'Already Scanned!', team }
    }

    // 3. Log Success
    const { error: logError } = await supabase.from('attendance_logs').insert({
        qr_code_scanned: team.id,
        scanned_by: user.id,
        status: 'success',
    })

    if (logError) {
        return { success: false, message: `System Error Logging Attendance: ${logError.message}` }
    }

    return { success: true, message: 'Access Granted', team }
}
