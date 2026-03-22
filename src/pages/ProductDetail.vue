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
					<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
							<div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-white">
								<img
									v-if="productImage"
									:src="productImage"
									:alt="product.name"
									class="h-full max-h-105 w-full object-contain"
								/>
								<div v-else class="flex h-80 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
									Imagem indisponivel
								</div>
							</div>

							<div class="rounded-xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/70">
								<div class="flex items-start justify-between gap-3">
									<p class="m-0 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-primary w-fit">Produto</p>
									<div class="flex flex-col items-end gap-2">
										<p v-if="product.category?.name" class="m-0 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
											Categoria: {{ product.category.name }}
										</p>
										<span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
											{{ product.stock > 0 ? 'Em estoque' : 'Indisponivel' }}
										</span>
									</div>
								</div>

								<h1 class="m-0 mt-3 text-center text-3xl font-extrabold tracking-tight text-brand-primary drop-shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:text-brand-secondary">{{ product.name }}</h1>

								<div class="mt-6 flex justify-center">
									<div class="w-full max-w-sm bg-transparent p-0 text-center">
										<p class="m-0 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ formatPrice(product.price) }}</p>
										<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">
											{{ installments }}x sem juros de {{ formatPrice(installmentValue) }}
										</p>
										<p class="m-0 mt-2 text-sm font-semibold text-brand-primary">
											No pix: {{ formatPrice(pixPrice) }}
										</p>
									</div>
								</div>

								<p v-if="cartMessage" class="m-0 mt-3 text-sm text-brand-primary">{{ cartMessage }}</p>

								<div class="mt-4 flex justify-center">
									<button
										type="button"
										:disabled="isAddingToCart"
										class="inline-flex h-11 w-fit items-center rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-70"
										@click="addToCart"
									>
										{{ isAddingToCart ? 'Adicionando...' : 'Adicionar ao carrinho' }}
									</button>
								</div>
							</div>
						</div>
					</div>

					<div v-if="descriptionBanner" class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
						<img :src="descriptionBanner" :alt="`${product.name} banner`" class="w-full object-cover" />
						<div v-if="textPhrase || textIntroduction" class="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
							<p v-if="textPhrase" class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">{{ textPhrase }}</p>
							<p v-if="textIntroduction" class="m-0 mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ textIntroduction }}</p>
						</div>
					</div>

					<div v-if="extraEntries.length" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Mais informacoes</h2>
						<div class="mt-4 space-y-3">
							<div v-for="entry in extraEntries" :key="entry.key" class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
								<p class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ entry.key }}</p>
								<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">{{ entry.value }}</p>
							</div>
						</div>
					</div>

					<div v-if="specificationEntries.length" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Especificacoes</h2>
						<div class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
							<div v-for="entry in specificationEntries" :key="entry.key" class="grid grid-cols-1 gap-2 border-b border-slate-200 p-3 last:border-b-0 sm:grid-cols-[220px_1fr] dark:border-slate-700">
								<p class="m-0 text-sm font-medium text-slate-800 dark:text-slate-100">{{ entry.key }}</p>
								<p class="m-0 text-sm text-slate-600 dark:text-slate-300">{{ entry.value }}</p>
							</div>
						</div>
					</div>

					<div v-if="documentationEntries.length" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Documentacao</h2>
						<div class="mt-4 space-y-2">
							<a
								v-for="entry in documentationEntries"
								:key="entry.key"
								:href="entry.value"
								target="_blank"
								rel="noreferrer noopener"
								class="block rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-brand-primary no-underline transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
							>
								{{ entry.key }}
							</a>
						</div>
					</div>

					<div v-if="comesWithEntries.length" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">O que acompanha</h2>
						<div class="mt-4 space-y-2">
							<div v-for="entry in comesWithEntries" :key="entry.key" class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60">
								<span class="font-medium text-slate-800 dark:text-slate-100">{{ entry.key }}</span>
								<span class="text-slate-600 dark:text-slate-300">{{ entry.value }}</span>
							</div>
						</div>
					</div>

					<div v-if="hasPinout" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Pinout</h2>
						<p v-if="pinoutIntroduction" class="m-0 mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{{ pinoutIntroduction }}</p>
						<img v-if="pinoutImage" :src="pinoutImage" alt="Pinout" class="mt-4 mx-auto w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
					</div>

					<div v-if="hasDimensions" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Dimensoes</h2>
						<p v-if="dimensionsIntroduction" class="m-0 mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{{ dimensionsIntroduction }}</p>
						<img v-if="dimensionsImage" :src="dimensionsImage" alt="Dimensoes" class="mt-4 max-h-105 w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700" />
					</div>

					<div v-if="hasVideo" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Video</h2>
						<p v-if="videoIntroduction" class="m-0 mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{{ videoIntroduction }}</p>
						<div v-if="videoEmbedLink" class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
							<div class="aspect-video">
								<iframe
									class="h-full w-full"
									:src="videoEmbedLink"
									title="Video do produto"
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowfullscreen
								></iframe>
							</div>
						</div>
						<p v-else-if="videoLink" class="m-0 mt-3 text-sm text-slate-600 dark:text-slate-300">
							Preview nao disponivel para este link. Abra em nova aba:
							<a :href="videoLink" target="_blank" rel="noreferrer noopener" class="font-semibold text-brand-primary">{{ videoLink }}</a>
						</p>
					</div>
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
import { supabase } from '../lib/supabase'
import { getCurrentSession } from '../services/auth.service'
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
		AppFooter
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
			cartMessage: ''
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
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
		},
		async loadProduct(): Promise<void> {
			this.isLoading = true
			this.errorMessage = ''
			this.cartMessage = ''

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
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		async onFavorites(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/perfil?tab=favorites' } })
				return
			}

			await this.$router.push({ name: 'perfil', query: { tab: 'favorites' } })
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
