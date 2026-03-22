import { supabase } from '../lib/supabase'

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

export type FavoriteItemWithProduct = {
	user_id: number
	product_id: number
	product_name: string
	product_price: number
	product_stock: number
	product_image: string | null
}

export async function getFavoriteItems(userId: number): Promise<FavoriteItemWithProduct[]> {
	const { data, error } = await supabase
		.from('favorite')
		.select(
			`
			user_id,
			product_id,
			product:product_id (
				name,
				price,
				stock,
				img,
				description
			)
		`
		)
		.eq('user_id', userId)
		.order('product_id', { ascending: false })

	if (error || !data) {
		return []
	}

	return data.map((item: any) => ({
		user_id: item.user_id,
		product_id: item.product_id,
		product_name: item.product?.name || 'Produto desconhecido',
		product_price: item.product?.price || 0,
		product_stock: item.product?.stock || 0,
		product_image: resolveProductImage(item.product)
	}))
}

export async function addFavoriteItem(userId: number, productId: number): Promise<void> {
	const { error } = await supabase
		.from('favorite')
		.upsert(
			{
				user_id: userId,
				product_id: productId
			},
			{
				onConflict: 'user_id,product_id',
				ignoreDuplicates: true
			}
		)

	if (error) {
		throw new Error(error.message)
	}
}

export async function removeFavoriteItem(userId: number, productId: number): Promise<void> {
	const { error } = await supabase
		.from('favorite')
		.delete()
		.eq('user_id', userId)
		.eq('product_id', productId)

	if (error) {
		throw new Error(error.message)
	}
}
