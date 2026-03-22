import type { User } from '@supabase/supabase-js'
import { hasSupabaseEnv, supabase } from '../lib/supabase'
import { syncUserProfileFromAuth } from './user-profile.service'

export type CreateUserInput = {
	name: string
	email: string
	password: string
	role_id?: number
}

export type CreatedUserResult = {
	authUser: User
	requiresEmailConfirmation: boolean
}

export async function createUserAccount(input: CreateUserInput): Promise<CreatedUserResult> {
	if (!hasSupabaseEnv) {
		throw new Error('Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
	}

	const { data, error } = await supabase.auth.signUp({
		email: input.email,
		password: input.password,
		options: {
			data: {
				name: input.name
			}
		}
	})

	if (error) {
		throw new Error(error.message)
	}

	if (!data.user) {
		throw new Error('Nao foi possivel criar o usuario no Auth.')
	}

	await syncUserProfileFromAuth(data.user, input.name)

	return {
		authUser: data.user,
		requiresEmailConfirmation: !data.session
	}
}
