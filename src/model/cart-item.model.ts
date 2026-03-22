import type { Cart } from './cart.model'
import type { Product } from './product.model'

export interface CartItem {
	cart_item_id: number
	cart_id: number
	product_id: number
	quantity: number
	cart?: Cart
	product?: Product
}
