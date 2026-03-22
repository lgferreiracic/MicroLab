import type { Address } from './address.model'
import type { Cart } from './cart.model'
import type { Favorite } from './favorite.model'
import type { Order } from './order.model'
import type { Role } from './role.model'

export interface User {
	user_id: number
	name: string
	email: string
	password_hash: string
	role_id: number
	role?: Role
	addresses?: Address[]
	orders?: Order[]
	cart?: Cart | null
	favorites?: Favorite[]
}
