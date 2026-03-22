<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Busca" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<h1 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-2xl font-extrabold tracking-tight text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Resultados da busca</h1>
				<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">
					{{ resultsDescription }}
				</p>

				<div v-if="isLoading" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					Carregando produtos...
				</div>

				<div v-else-if="errorMessage" class="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
					{{ errorMessage }}
				</div>

				<div v-else-if="!filteredProducts.length" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-sm text-slate-600 dark:text-slate-300">Nenhum produto encontrado para os filtros informados.</p>
				</div>

				<div v-else class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<RouterLink
						v-for="product in filteredProducts"
						:key="product.id"
						:to="{ name: 'product-detail', params: { id: product.id } }"
						class="flex h-full rounded-xl border border-slate-200 bg-white p-3 no-underline transition hover:opacity-95 dark:border-slate-700 dark:bg-slate-900"
					>
						<ProductCard class="w-full" :product="product" />
					</RouterLink>
				</div>
			</div>
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ProductCard from '../components/product/ProductCard.vue'
import { getCurrentSession } from '../services/auth.service'
import { getCatalogProducts, type ProductCatalogItem } from '../services/product.service'

type ProductCardItem = {
	id: number
	name: string
	image: string
	price: number
	installments: number
	categoryName: string
}

export default defineComponent({
	name: 'SearchView',
	components: {
		RouterLink,
		AppHeader,
		AppNavbar,
		AppFooter,
		ProductCard
	},
	data() {
		return {
			products: [] as ProductCardItem[],
			isLoading: true,
			errorMessage: ''
		}
	},
	computed: {
		searchName(): string {
			const value = this.$route.query.q
			return typeof value === 'string' ? value.trim() : ''
		},
		searchCategory(): string {
			const value = this.$route.query.category
			return typeof value === 'string' ? value.trim() : ''
		},
		filteredProducts(): ProductCardItem[] {
			const nameFilter = this.searchName.toLowerCase()
			const categoryFilter = this.searchCategory.toLowerCase()

			return this.products.filter((product) => {
				const matchesName = !nameFilter || product.name.toLowerCase().includes(nameFilter)
				const matchesCategory = !categoryFilter || product.categoryName.toLowerCase() === categoryFilter
				return matchesName && matchesCategory
			})
		},
		resultsDescription(): string {
			if (this.searchName && this.searchCategory) {
				return `Resultados para "${this.searchName}" na categoria "${this.searchCategory}".`
			}

			if (this.searchName) {
				return `Resultados para nome de produto: "${this.searchName}".`
			}

			if (this.searchCategory) {
				return `Resultados da categoria: "${this.searchCategory}".`
			}

			return 'Digite um termo na busca ou selecione uma categoria na navbar.'
		}
	},
	async created() {
		await this.loadProducts()
	},
	methods: {
		async loadProducts(): Promise<void> {
			this.isLoading = true
			this.errorMessage = ''

			try {
				const products = await getCatalogProducts()
				this.products = products.map((product) => ({
					id: product.product_id,
					name: product.name,
					image: this.resolveProductImage(product),
					price: product.price,
					installments: this.calculateInstallments(product.price),
					categoryName: product.category_name
				}))
			} catch (error) {
				this.products = []
				this.errorMessage = error instanceof Error ? error.message : 'Nao foi possivel carregar os produtos.'
			} finally {
				this.isLoading = false
			}
		},
		resolveProductImage(product: ProductCatalogItem): string {
			const description = this.toRecord(product.description)
			const img = this.toRecord(product.img)
			const imgBanner = this.toText(img?.banner)
			const descBanner = this.toText(description?.banner)

			if (imgBanner) {
				return imgBanner
			}

			if (descBanner) {
				return descBanner
			}

			return ''
		},
		calculateInstallments(price: number): number {
			if (price >= 500) {
				return 12
			}

			if (price >= 250) {
				return 10
			}

			return 6
		},
		toRecord(value: unknown): Record<string, unknown> | null {
			if (!value || typeof value !== 'object' || Array.isArray(value)) {
				return null
			}

			return value as Record<string, unknown>
		},
		toText(value: unknown): string {
			return typeof value === 'string' ? value : ''
		},
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		async onFavorites(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/favoritos' } })
				return
			}
			await this.$router.push({ name: 'favorites' })
		},
		async onLogin(): Promise<void> {
			const session = await getCurrentSession()
			if (session) {
				await this.$router.push({ name: 'perfil' })
				return
			}
			await this.$router.push({ name: 'sign-in' })
		},
		async onCart(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/cart' } })
				return
			}
			await this.$router.push({ name: 'cart' })
		}
	}
})
</script>
