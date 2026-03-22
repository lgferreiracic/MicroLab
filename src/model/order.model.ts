import type { OrderItem } from './order-item.model'

export interface Order {
	order_id: number
	user_id: number
	total_price: number
	status: string
	created_at: string
	items?: OrderItem[]
}
