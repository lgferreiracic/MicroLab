import {
	getCurrentAuthUser,
	getCurrentSession,
	signInWithEmail,
	signOutUser
} from '../services/auth.service'
import { createUserAccount } from '../services/user-creation.service'

export type AuthUser = {
	name: string
	email: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
	const user = await getCurrentAuthUser()
	if (!user) {
		return null
	}

	return {
		name: String(user.user_metadata?.name || user.email || 'Usuario'),
		email: user.email || ''
	}
}

export async function isAuthenticated(): Promise<boolean> {
	const session = await getCurrentSession()
	return Boolean(session)
}

export async function signIn(user: AuthUser & { password: string }): Promise<void> {
	await signInWithEmail({
		email: user.email,
		password: user.password
	})
}

export async function signUp(user: AuthUser & { password: string }): Promise<void> {
	await createUserAccount({
		name: user.name,
		email: user.email,
		password: user.password
	})
}

export async function signOut(): Promise<void> {
	await signOutUser()
}
