const AUTH_STORAGE_KEY = 'microlab-auth-user'

export type AuthUser = {
	name: string
	email: string
}

export function getAuthUser(): AuthUser | null {
	try {
		const raw = localStorage.getItem(AUTH_STORAGE_KEY)
		if (!raw) {
			return null
		}
		return JSON.parse(raw) as AuthUser
	} catch {
		return null
	}
}

export function isAuthenticated(): boolean {
	return getAuthUser() !== null
}

export function signIn(user: AuthUser): void {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function signUp(user: AuthUser): void {
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function signOut(): void {
	localStorage.removeItem(AUTH_STORAGE_KEY)
}
