import type { User } from './user.model'

export interface Address {
	address_id: number
	user_id: number
	street: string
	number: string
	complement?: string | null
	neighborhood: string
	city: string
	state: string
	zip_code: string
	country: string
	user?: User
}
