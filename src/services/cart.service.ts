import { supabase } from '../lib/supabase'

export type CartItemWithProduct = {
	cart_item_id: number
	cart_id: number
	product_id: number
	quantity: number
	product_name: string
	product_image: string | null
	product_price: number
}

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

/**
 * Get user's cart ID from database
 */
export async function getUserCartId(userId: number): Promise<number | null> {
	const { data, error } = await supabase
		.from('cart')
		.select('cart_id')
		.eq('user_id', userId)
		.maybeSingle()

	if (error || !data) {
		return null
	}

	return data.cart_id
}

/**
 * Get all cart items with product details for a specific user
 */
export async function getCartItems(userId: number): Promise<CartItemWithProduct[]> {
	const cartId = await getUserCartId(userId)

	if (!cartId) {
		return []
	}

	const { data, error } = await supabase
		.from('cart_item')
		.select(
			`
			cart_item_id,
			cart_id,
			product_id,
			quantity,
			product:product_id (
				name,
				price,
				img,
				description
			)
		`
		)
		.eq('cart_id', cartId)
		.order('cart_item_id', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.map((item: any) => ({
		cart_item_id: item.cart_item_id,
		cart_id: item.cart_id,
		product_id: item.product_id,
		quantity: item.quantity,
		product_name: item.product?.name || 'Produto desconhecido',
		product_image: resolveProductImage(item.product),
		product_price: item.product?.price || 0
	}))
}

/**
 * Update quantity of a cart item
 */
export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
	const { error } = await supabase
		.from('cart_item')
		.update({ quantity })
		.eq('cart_item_id', cartItemId)

	if (error) {
		throw new Error(error.message)
	}
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: number): Promise<void> {
	const { error } = await supabase
		.from('cart_item')
		.delete()
		.eq('cart_item_id', cartItemId)

	if (error) {
		throw new Error(error.message)
	}
}

/**
 * Clear all items from user's cart
 */
export async function clearCart(userId: number): Promise<void> {
	const cartId = await getUserCartId(userId)

	if (!cartId) {
		return
	}

	const { error } = await supabase
		.from('cart_item')
		.delete()
		.eq('cart_id', cartId)

	if (error) {
		throw new Error(error.message)
	}
}

/**
 * Calculate total price for all cart items
 */
export function calculateCartTotal(items: CartItemWithProduct[]): number {
	return items.reduce((total, item) => total + item.product_price * item.quantity, 0)
}
