import type { User } from '@supabase/supabase-js'
import { hasSupabaseEnv, supabase } from '../lib/supabase'

function getDisplayName(authUser: User, fallbackName?: string): string {
	if (fallbackName?.trim()) {
		return fallbackName.trim()
	}

	const metadataName = authUser.user_metadata?.name
	if (typeof metadataName === 'string' && metadataName.trim()) {
		return metadataName.trim()
	}

	return authUser.email?.split('@')[0] || 'Usuario'
}

export async function syncUserProfileFromAuth(authUser: User, fallbackName?: string): Promise<boolean> {
	if (!hasSupabaseEnv || !authUser.email) {
		return false
	}

	const basePayload = {
		name: getDisplayName(authUser, fallbackName),
		email: authUser.email,
		password_hash: 'SUPABASE_AUTH',
		role_id: 2
	}

	// Primeiro tenta schema com auth_uid (quando migration 012 ja foi aplicada).
	const withAuthUid = await supabase.from('users').upsert(
		{
			...basePayload,
			auth_uid: authUser.id
		},
		{ onConflict: 'email' }
	)

	if (!withAuthUid.error) {
		return true
	}

	// Fallback para schema sem auth_uid para destravar desenvolvimento.
	const withoutAuthUid = await supabase.from('users').upsert(basePayload, { onConflict: 'email' })
	if (!withoutAuthUid.error) {
		return true
	}

	console.warn('Nao foi possivel sincronizar perfil em public.users:', withoutAuthUid.error.message)
	return false
}
