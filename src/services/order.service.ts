import { supabase } from '../lib/supabase'
import type { CartItemWithProduct } from './cart.service'

type JsonRecord = Record<string, unknown>

function toRecord(value: unknown): JsonRecord | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null
	}

	return value as JsonRecord
}

function toText(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function resolveProductImage(product: { img?: unknown; description?: unknown } | null | undefined): string | null {
	const img = toRecord(product?.img)
	const description = toRecord(product?.description)

	const imgBanner = toText(img?.banner)
	if (imgBanner) {
		return imgBanner
	}

	const gallery = img?.gallery
	if (Array.isArray(gallery) && gallery.length > 0) {
		const firstGallery = toText(gallery[0])
		if (firstGallery) {
			return firstGallery
		}
	}

	const descriptionBanner = toText(description?.banner)
	if (descriptionBanner) {
		return descriptionBanner
	}

	return null
}

export type OrderItemDetail = {
	order_item_id: number
	product_id: number
	quantity: number
	unit_price: number
	product_name: string
	product_image: string | null
}

export type UserOrder = {
	order_id: number
	total_price: number
	status: string
	created_at: string
	items: OrderItemDetail[]
}

export async function createOrderFromCart(userId: number, cartItems: CartItemWithProduct[], totalPrice: number): Promise<number> {
	const { data: orderData, error: orderError } = await supabase
		.from('orders')
		.insert({
			user_id: userId,
			total_price: totalPrice,
			status: 'Confirmado'
		})
		.select('order_id')
		.single()

	if (orderError || !orderData?.order_id) {
		throw new Error(orderError?.message || 'Nao foi possivel criar o pedido.')
	}

	const orderItemsPayload = cartItems.map((item) => ({
		order_id: orderData.order_id,
		product_id: item.product_id,
		quantity: item.quantity,
		unit_price: item.product_price
	}))

	const { error: orderItemsError } = await supabase
		.from('order_item')
		.insert(orderItemsPayload)

	if (orderItemsError) {
		throw new Error(orderItemsError.message)
	}

	return orderData.order_id
}

export async function getUserOrders(userId: number): Promise<UserOrder[]> {
	const { data, error } = await supabase
		.from('orders')
		.select(
			`
			order_id,
			total_price,
			status,
			created_at,
			order_item (
				order_item_id,
				product_id,
				quantity,
				unit_price,
				product:product_id (
					name,
					img,
					description
				)
			)
		`
		)
		.eq('user_id', userId)
		.order('created_at', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.map((order: any) => ({
		order_id: order.order_id,
		total_price: Number(order.total_price) || 0,
		status: order.status || 'Pendente',
		created_at: order.created_at,
		items: (order.order_item || []).map((item: any) => ({
			order_item_id: item.order_item_id,
			product_id: item.product_id,
			quantity: item.quantity,
			unit_price: Number(item.unit_price) || 0,
			product_name: item.product?.name || 'Produto desconhecido',
			product_image: resolveProductImage(item.product)
		}))
	}))
}
