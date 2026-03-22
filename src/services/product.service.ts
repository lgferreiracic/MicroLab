import { supabase } from '../lib/supabase'
import type { Product } from '../model/product.model'

type CategoryJoin = {
	name: string
}

type ProductRow = Omit<Product, 'category'> & {
	category: CategoryJoin[] | CategoryJoin | null
}

export type ProductCatalogItem = {
	product_id: number
	name: string
	price: number
	stock: number
	img: Product['img']
	description: Product['description']
	category_id: number
	category_name: string
}

export async function getCatalogProducts(): Promise<ProductCatalogItem[]> {
	const { data, error } = await supabase
		.from('product')
		.select(`
			product_id,
			name,
			price,
			stock,
			img,
			description,
			category_id,
			category:category_id (name)
		`)
		.order('category_id', { ascending: true })
		.order('product_id', { ascending: true })

	if (error) {
		throw new Error(error.message)
	}

	const rows = (data || []) as ProductRow[]

	return rows.map((row) => {
		const categoryData = Array.isArray(row.category) ? row.category[0] : row.category

		return {
			product_id: row.product_id,
			name: row.name,
			price: row.price,
			stock: row.stock,
			img: row.img,
			description: row.description,
			category_id: row.category_id,
			category_name: categoryData?.name || 'Sem categoria'
		}
	})
}

export async function getProductById(productId: number): Promise<Product | null> {
	const { data, error } = await supabase
		.from('product')
		.select(`
			product_id,
			name,
			price,
			stock,
			img,
			description,
			category_id,
			category:category_id (name)
		`)
		.eq('product_id', productId)
		.maybeSingle()

	if (error) {
		throw new Error(error.message)
	}

	if (!data) {
		return null
	}

	const row = data as ProductRow
	const categoryData = Array.isArray(row.category) ? row.category[0] : row.category

	return {
		product_id: row.product_id,
		name: row.name,
		price: row.price,
		stock: row.stock,
		img: row.img,
		description: row.description,
		category_id: row.category_id,
		category: categoryData?.name ? { category_id: row.category_id, name: categoryData.name } : undefined
	}
}
