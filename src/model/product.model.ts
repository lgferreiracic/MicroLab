import type { CartItem } from './cart-item.model'
import type { Category } from './category.model'

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export type JsonObject = {
	[key: string]: JsonValue
}
export type JsonArray = JsonValue[]

export interface Product {
	product_id: number
	name: string
	price: number
	stock: number
	img: JsonValue
	description: JsonValue
	category_id: number
	category?: Category
	order_items?: ProductOrderItemRef[]
	cart_items?: CartItem[]
	favorites?: ProductFavoriteRef[]
}

export type ProductOrderItemRef = {
	order_item_id: number
	order_id: number
	product_id: number
	quantity: number
	unit_price: number
}

export type ProductFavoriteRef = {
	user_id: number
	product_id: number
}
