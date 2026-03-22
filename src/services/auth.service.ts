import type { Session, User } from '@supabase/supabase-js'
import { hasSupabaseEnv, supabase } from '../lib/supabase'
import { syncUserProfileFromAuth } from './user-profile.service'

export type SignInInput = {
	email: string
	password: string
}

export async function signInWithEmail(input: SignInInput): Promise<User> {
	if (!hasSupabaseEnv) {
		throw new Error('Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email: input.email,
		password: input.password
	})

	if (error) {
		throw new Error(error.message)
	}

	if (!data.user) {
		throw new Error('Nao foi possivel autenticar o usuario.')
	}

	await syncUserProfileFromAuth(data.user)

	return data.user
}

export async function signOutUser(): Promise<void> {
	if (!hasSupabaseEnv) {
		return
	}

	const { error } = await supabase.auth.signOut()
	if (error) {
		throw new Error(error.message)
	}
}

export async function getCurrentSession(): Promise<Session | null> {
	if (!hasSupabaseEnv) {
		return null
	}

	const { data, error } = await supabase.auth.getSession()
	if (error) {
		throw new Error(error.message)
	}

	return data.session
}

export async function getCurrentAuthUser(): Promise<User | null> {
	if (!hasSupabaseEnv) {
		return null
	}

	const { data, error } = await supabase.auth.getUser()
	if (error) {
		throw new Error(error.message)
	}

	return data.user
}

export async function updateCurrentUserPassword(newPassword: string): Promise<void> {
	if (!hasSupabaseEnv) {
		throw new Error('Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
	}

	const { error } = await supabase.auth.updateUser({
		password: newPassword
	})

	if (error) {
		throw new Error(error.message)
	}
}
