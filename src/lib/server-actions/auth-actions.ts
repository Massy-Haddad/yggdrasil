'use server'
import z from 'zod'
import { FormSchema } from '../types'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login({ email, password }: z.infer<typeof FormSchema>) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: email,
		password: password,
	}

	const { error } = await supabase.auth.signInWithPassword(data)

	if (error) return error

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signup({ email, password }: z.infer<typeof FormSchema>) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: email,
		password: password,
	}

	const { error } = await supabase.auth.signUp(data)

	if (error) return error

	revalidatePath('/', 'layout')
	redirect('/')
}
