import type { User } from './user.model'

export interface Role {
	role_id: number
	name: string
	users?: User[]
}
