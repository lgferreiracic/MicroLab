import type { Product } from './product.model'

export interface Category {
	category_id: number
	name: string
	products?: Product[]
}
