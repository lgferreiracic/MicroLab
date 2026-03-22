export interface Order {
	order_id: number
	user_id: number
	total_price: number
	status: string
	created_at: string
	items?: OrderItemRef[]
}

export type OrderItemRef = {
	order_item_id: number
	order_id: number
	product_id: number
	quantity: number
	unit_price: number
}
