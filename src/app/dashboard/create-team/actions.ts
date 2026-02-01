'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper to upload to Cloudinary
async function uploadToCloudinary(file: File, folder: string): Promise<string | null> {
    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        })

        if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Upload failed: No secure_url in response")
        }

        return uploadResult.secure_url
    } catch (error) {
        console.error('Cloudinary Upload Error:', error)
        throw error // Re-throw to be handled by caller
    }
}

export async function createTeam(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const teamName = formData.get('teamName') as string
    const paymentProofFile = formData.get('paymentProof') as File
    const memberCount = parseInt(formData.get('memberCount') as string)

    if (!teamName || !paymentProofFile) {
        return { error: 'Missing required fields' }
    }

    // 0. Upload Payment Proof
    let paymentLink = ''
    try {
        const url = await uploadToCloudinary(paymentProofFile, 'payment-proofs')
        if (url) paymentLink = url
    } catch (error: any) {
        return { error: `Payment upload failed: ${error.message}` }
    }

    // 1. Create Team
    const { data: team, error: teamError } = await supabase.from('teams').insert({
        name: teamName,
        leader_id: user.id,
        payment_proof_link: paymentLink,
        status: 'pending',
        qr_code: undefined
    }).select().single()

    if (teamError) {
        return { error: `Team creation failed: ${teamError.message}` }
    }

    // 2. Create Members
    const membersData = []
    for (let i = 0; i < memberCount; i++) {
        const name = formData.get(`member_${i}_name`) as string
        const regNo = formData.get(`member_${i}_reg_no`) as string
        const photoFile = formData.get(`member_${i}_photo`) as File

        if (name && name.trim() !== '') {
            let photoUrl = null
            if (photoFile && photoFile.size > 0) {
                try {
                    photoUrl = await uploadToCloudinary(photoFile, 'member-photos')
                } catch (e) {
                    console.error(`Failed to upload photo for member ${i}:`, e)
                    // For now, let's continue without photo but log error
                }
            }

            membersData.push({
                team_id: team.id,
                name: name.trim(),
                reg_no: regNo ? regNo.trim() : null,
                photo_url: photoUrl
            })
        }
    }

    if (membersData.length > 0) {
        const { error: membersError } = await supabase.from('team_members').insert(membersData)
        if (membersError) {
            return { error: `Failed to add members: ${membersError.message}` }
        }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
