<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Detalhes do produto" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl space-y-6">
				<div v-if="isLoading" class="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					Carregando detalhes do produto...
				</div>

				<div v-else-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
					{{ errorMessage }}
				</div>

				<template v-else-if="product">
					<ProductDetailHero
						:product="product"
						:product-image="productImage"
						:installments="installments"
						:installment-value="installmentValue"
						:pix-price="pixPrice"
						:is-adding-to-cart="isAddingToCart"
						:cart-message="cartMessage"
						:is-adding-to-favorites="isAddingToFavorites"
						:favorite-message="favoriteMessage"
						@add-cart="addToCart"
						@add-favorite="addToFavorites"
					/>

					<ProductDetailBannerIntro
						v-if="descriptionBanner"
						:product-name="product.name"
						:description-banner="descriptionBanner"
						:text-phrase="textPhrase"
						:text-introduction="textIntroduction"
					/>

					<ProductDetailInfoCards v-if="extraEntries.length" title="Mais informacoes" :entries="extraEntries" />

					<ProductDetailSpecTable v-if="specificationEntries.length" :entries="specificationEntries" />

					<ProductDetailDocumentationLinks v-if="documentationEntries.length" :entries="documentationEntries" />

					<ProductDetailComesWith v-if="comesWithEntries.length" :entries="comesWithEntries" />

					<ProductDetailImageBlock
						v-if="hasPinout"
						title="Pinout"
						:introduction="pinoutIntroduction"
						:image-url="pinoutImage"
						image-alt="Pinout"
						image-class="mt-4 mx-auto w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700"
					/>

					<ProductDetailImageBlock
						v-if="hasDimensions"
						title="Dimensoes"
						:introduction="dimensionsIntroduction"
						:image-url="dimensionsImage"
						image-alt="Dimensoes"
						image-class="mt-4 max-h-105 w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700"
					/>

					<ProductDetailVideoBlock
						v-if="hasVideo"
						:video-introduction="videoIntroduction"
						:video-link="videoLink"
						:video-embed-link="videoEmbedLink"
					/>
				</template>
			</div>
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ProductDetailHero from '../components/product-detail/ProductDetailHero.vue'
import ProductDetailBannerIntro from '../components/product-detail/ProductDetailBannerIntro.vue'
import ProductDetailInfoCards from '../components/product-detail/ProductDetailInfoCards.vue'
import ProductDetailSpecTable from '../components/product-detail/ProductDetailSpecTable.vue'
import ProductDetailDocumentationLinks from '../components/product-detail/ProductDetailDocumentationLinks.vue'
import ProductDetailComesWith from '../components/product-detail/ProductDetailComesWith.vue'
import ProductDetailImageBlock from '../components/product-detail/ProductDetailImageBlock.vue'
import ProductDetailVideoBlock from '../components/product-detail/ProductDetailVideoBlock.vue'
import { supabase } from '../lib/supabase'
import { getCurrentSession } from '../services/auth.service'
import { addFavoriteItem } from '../services/favorite.service'
import { getProductById } from '../services/product.service'

type StringEntry = {
	key: string
	value: string
}

type JsonRecord = Record<string, unknown>

type ProductDetailData = {
	product_id: number
	name: string
	price: number
	stock: number
	img: unknown
	description: unknown
	category?: {
		name: string
	}
}

export default defineComponent({
	name: 'ProductDetail',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter,
		ProductDetailHero,
		ProductDetailBannerIntro,
		ProductDetailInfoCards,
		ProductDetailSpecTable,
		ProductDetailDocumentationLinks,
		ProductDetailComesWith,
		ProductDetailImageBlock,
		ProductDetailVideoBlock
	},
	props: {
		id: {
			type: [String, Number],
			required: false
		}
	},
	data() {
		return {
			product: null as ProductDetailData | null,
			isLoading: true,
			errorMessage: '',
			isAddingToCart: false,
			cartMessage: '',
			isAddingToFavorites: false,
			favoriteMessage: ''
		}
	},
	computed: {
		descriptionRecord(): JsonRecord | null {
			return this.toRecord((this.product as { description?: unknown } | null)?.description)
		},
		imgRecord(): JsonRecord | null {
			return this.toRecord((this.product as { img?: unknown } | null)?.img)
		},
		descriptionBanner(): string {
			return this.toText(this.descriptionRecord?.banner)
		},
		productImage(): string {
			const fromImgBanner = this.toText(this.imgRecord?.banner)
			if (fromImgBanner) {
				return fromImgBanner
			}

			const gallery = this.toRecordArray(this.imgRecord?.gallery)
			if (gallery.length) {
				return this.toText(gallery[0])
			}

			return ''
		},
		installments(): number {
			if (!this.product) {
				return 1
			}

			if (this.product.price >= 500) {
				return 12
			}

			if (this.product.price >= 250) {
				return 10
			}

			return 6
		},
		installmentValue(): number {
			if (!this.product || this.installments <= 0) {
				return 0
			}

			return this.product.price / this.installments
		},
		pixPrice(): number {
			if (!this.product) {
				return 0
			}

			return this.product.price * 0.9
		},
		textSection(): JsonRecord | null {
			return this.toRecord(this.descriptionRecord?.text)
		},
		textPhrase(): string {
			return this.toText(this.textSection?.phrase)
		},
		textIntroduction(): string {
			return this.toText(this.textSection?.introduction)
		},
		extraEntries(): StringEntry[] {
			const extra = this.toRecord(this.textSection?.extra)
			return this.objectEntries(extra)
		},
		specificationEntries(): StringEntry[] {
			return this.objectEntries(this.toRecord(this.descriptionRecord?.specifications))
		},
		documentationEntries(): StringEntry[] {
			return this.objectEntries(this.toRecord(this.descriptionRecord?.documentation))
		},
		comesWithEntries(): StringEntry[] {
			return this.objectEntries(this.toRecord(this.descriptionRecord?.['comes-with']))
		},
		pinoutSection(): JsonRecord | null {
			return this.toRecord(this.descriptionRecord?.pinout)
		},
		hasPinout(): boolean {
			return Boolean(this.pinoutIntroduction || this.pinoutImage)
		},
		pinoutIntroduction(): string {
			return this.toText(this.pinoutSection?.introduction)
		},
		pinoutImage(): string {
			return this.toText(this.pinoutSection?.img)
		},
		dimensionsSection(): JsonRecord | null {
			const dimensions = this.descriptionRecord?.dimensions
			const dimentions = this.descriptionRecord?.dimentions
			return this.toRecord(dimensions || dimentions)
		},
		hasDimensions(): boolean {
			return Boolean(this.dimensionsIntroduction || this.dimensionsImage)
		},
		dimensionsIntroduction(): string {
			return this.toText(this.dimensionsSection?.introduction)
		},
		dimensionsImage(): string {
			return this.toText(this.dimensionsSection?.img)
		},
		videoSection(): JsonRecord | null {
			return this.toRecord(this.descriptionRecord?.video)
		},
		hasVideo(): boolean {
			return Boolean(this.videoIntroduction || this.videoLink)
		},
		videoIntroduction(): string {
			return this.toText(this.videoSection?.introduction)
		},
		videoLink(): string {
			return this.toText(this.videoSection?.link)
		},
		videoEmbedLink(): string {
			const link = this.videoLink.trim()
			if (!link) {
				return ''
			}

			if (link.includes('youtube.com/embed/')) {
				return link
			}

			const watchMatch = link.match(/[?&]v=([^&]+)/)
			if (link.includes('youtube.com/watch') && watchMatch?.[1]) {
				return `https://www.youtube.com/embed/${watchMatch[1]}`
			}

			const shortMatch = link.match(/youtu\.be\/([^?&/]+)/)
			if (shortMatch?.[1]) {
				return `https://www.youtube.com/embed/${shortMatch[1]}`
			}

			return ''
		}
	},
	async created() {
		await this.loadProduct()
	},
	methods: {
		toRecord(value: unknown): JsonRecord | null {
			if (!value || typeof value !== 'object' || Array.isArray(value)) {
				return null
			}

			return value as JsonRecord
		},
		toRecordArray(value: unknown): unknown[] {
			return Array.isArray(value) ? value : []
		},
		toText(value: unknown): string {
			return typeof value === 'string' ? value : ''
		},
		objectEntries(record: JsonRecord | null): StringEntry[] {
			if (!record) {
				return []
			}

			return Object.entries(record)
				.filter((entry) => typeof entry[1] === 'string' && String(entry[1]).trim().length > 0)
				.map((entry) => ({ key: entry[0], value: String(entry[1]) }))
		},
		async loadProduct(): Promise<void> {
			this.isLoading = true
			this.errorMessage = ''
			this.cartMessage = ''
			this.favoriteMessage = ''

			const rawId = this.id ?? this.$route.params.id
			const parsedId = Number(rawId)

			if (!Number.isFinite(parsedId) || parsedId <= 0) {
				this.product = null
				this.errorMessage = 'Produto invalido.'
				this.isLoading = false
				return
			}

			try {
				this.product = await getProductById(parsedId)
				if (!this.product) {
					this.errorMessage = 'Produto nao encontrado.'
				}
			} catch (error) {
				this.product = null
				this.errorMessage = error instanceof Error ? error.message : 'Falha ao carregar produto.'
			} finally {
				this.isLoading = false
			}
		},
		async resolveAppUserId(authUid: string, email: string): Promise<number | null> {
			const byAuthUid = await supabase
				.from('users')
				.select('user_id')
				.eq('auth_uid', authUid)
				.maybeSingle()

			if (!byAuthUid.error && byAuthUid.data?.user_id) {
				return byAuthUid.data.user_id
			}

			const byEmail = await supabase
				.from('users')
				.select('user_id')
				.eq('email', email)
				.maybeSingle()

			if (!byEmail.error && byEmail.data?.user_id) {
				return byEmail.data.user_id
			}

			return null
		},
		async addToCart(): Promise<void> {
			if (!this.product) {
				this.cartMessage = 'Produto invalido para adicionar ao carrinho.'
				return
			}

			this.isAddingToCart = true
			this.cartMessage = ''

			try {
				const session = await getCurrentSession()
				if (!session?.user?.email) {
					await this.$router.push({ name: 'sign-in', query: { redirect: this.$route.fullPath } })
					return
				}

				const appUserId = await this.resolveAppUserId(session.user.id, session.user.email)
				if (!appUserId) {
					throw new Error('Nao foi possivel identificar o usuario para o carrinho.')
				}

				const existingCart = await supabase
					.from('cart')
					.select('cart_id')
					.eq('user_id', appUserId)
					.maybeSingle()

				let cartId = existingCart.data?.cart_id as number | undefined
				if (!cartId) {
					const createdCart = await supabase
						.from('cart')
						.insert({ user_id: appUserId })
						.select('cart_id')
						.single()

					if (createdCart.error || !createdCart.data?.cart_id) {
						throw new Error(createdCart.error?.message || 'Nao foi possivel criar carrinho.')
					}

					cartId = createdCart.data.cart_id
				}

				const existingItem = await supabase
					.from('cart_item')
					.select('cart_item_id, quantity')
					.eq('cart_id', cartId)
					.eq('product_id', this.product.product_id)
					.maybeSingle()

				if (existingItem.data?.cart_item_id) {
					const updateResult = await supabase
						.from('cart_item')
						.update({ quantity: existingItem.data.quantity + 1 })
						.eq('cart_item_id', existingItem.data.cart_item_id)

					if (updateResult.error) {
						throw new Error(updateResult.error.message)
					}
				} else {
					const insertResult = await supabase
						.from('cart_item')
						.insert({
							cart_id: cartId,
							product_id: this.product.product_id,
							quantity: 1
						})

					if (insertResult.error) {
						throw new Error(insertResult.error.message)
					}
				}

				this.cartMessage = 'Produto adicionado ao carrinho.'
			} catch (error) {
				this.cartMessage = error instanceof Error ? error.message : 'Nao foi possivel adicionar ao carrinho.'
			} finally {
				this.isAddingToCart = false
			}
		},
		async addToFavorites(): Promise<void> {
			if (!this.product) {
				this.favoriteMessage = 'Produto invalido para favoritar.'
				return
			}

			this.isAddingToFavorites = true
			this.favoriteMessage = ''

			try {
				const session = await getCurrentSession()
				if (!session?.user?.email) {
					await this.$router.push({ name: 'sign-in', query: { redirect: this.$route.fullPath } })
					return
				}

				const appUserId = await this.resolveAppUserId(session.user.id, session.user.email)
				if (!appUserId) {
					throw new Error('Nao foi possivel identificar o usuario para favoritos.')
				}

				await addFavoriteItem(appUserId, this.product.product_id)
				this.favoriteMessage = 'Produto adicionado aos favoritos.'
			} catch (error) {
				this.favoriteMessage = error instanceof Error ? error.message : 'Nao foi possivel adicionar aos favoritos.'
			} finally {
				this.isAddingToFavorites = false
			}
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
