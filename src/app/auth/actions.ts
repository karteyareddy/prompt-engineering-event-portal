'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // validate fields
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // validate fields
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const fullName = formData.get('fullName') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
                full_name: fullName,
                role: 'participant'
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Create profile entry
    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username,
            full_name: fullName,
            role: 'participant'
        })

        if (profileError) {
            console.error('Profile creation failed:', profileError)
            // optional: rollback user creation or show error
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
