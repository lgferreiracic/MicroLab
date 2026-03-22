import type { CartItem } from './cart-item.model'
import type { User } from './user.model'

export interface Cart {
	cart_id: number
	user_id: number
	user?: User
	items?: CartItem[]
}
