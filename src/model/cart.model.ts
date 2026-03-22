import type { User } from './user.model'

export interface Cart {
	cart_id: number
	user_id: number
	user?: User
	items?: CartItemRef[]
}

export type CartItemRef = {
	cart_item_id: number
	cart_id: number
	product_id: number
	quantity: number
}
