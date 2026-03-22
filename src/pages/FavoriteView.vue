<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Meus favoritos" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<h1 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-2xl font-extrabold tracking-tight text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Favoritos</h1>

				<div v-if="!isLoggedIn" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Faça login para visualizar seus favoritos.</p>
					<div class="mt-4 text-center">
						<button
							type="button"
							class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
							@click="handleSignIn"
						>
							Fazer login
						</button>
					</div>
				</div>

				<div v-else-if="isLoading" class="mt-8 text-center">
					<p class="m-0 text-sm text-slate-600 dark:text-slate-300">Carregando favoritos...</p>
				</div>

				<div v-else-if="favoriteItems.length === 0" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Voce ainda nao possui produtos favoritados.</p>
					<div class="mt-4 text-center">
						<button
							type="button"
							class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
							@click="goHome"
						>
							Explorar produtos
						</button>
					</div>
				</div>

				<div v-else class="mt-8">
					<div class="mb-4 flex items-center justify-between">
						<p class="m-0 text-sm text-slate-600 dark:text-slate-300">{{ favoriteItems.length }} itens salvos</p>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						<div
							v-for="item in favoriteItems"
							:key="item.product_id"
							class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
						>
							<div class="h-48 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
								<img
									v-if="item.product_image"
									:src="item.product_image"
									:alt="item.product_name"
									class="h-full w-full object-contain p-2"
								/>
								<div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">
									Sem imagem
								</div>
							</div>

							<div class="mt-3">
								<h3 class="m-0 text-base font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</h3>
								<p class="m-0 mt-1 text-sm font-semibold text-brand-primary">{{ formatPrice(item.product_price) }}</p>
								<p class="m-0 mt-1 text-xs" :class="item.product_stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
									{{ item.product_stock > 0 ? 'Em estoque' : 'Indisponivel' }}
								</p>
							</div>

							<div class="mt-4 flex gap-2">
								<button
									type="button"
									class="flex-1 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
									@click="goToProduct(item.product_id)"
								>
									Ver produto
								</button>
								<button
									type="button"
									class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
									@click="removeFavorite(item.product_id)"
								>
									Remover
								</button>
							</div>
						</div>
					</div>
				</div>
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
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'
import { getFavoriteItems, removeFavoriteItem, type FavoriteItemWithProduct } from '../services/favorite.service'

export default defineComponent({
	name: 'FavoriteView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
	},
	data() {
		return {
			favoriteItems: [] as FavoriteItemWithProduct[],
			isLoggedIn: false,
			isLoading: true,
			appUserId: null as number | null
		}
	},
	async created() {
		const session = await getCurrentSession()
		this.isLoggedIn = !!session

		if (this.isLoggedIn) {
			const authUser = await getCurrentAuthUser()
			if (authUser?.email) {
				await this.resolveUserId(authUser.id, authUser.email)
				await this.loadFavoriteItems()
			}
		}

		this.isLoading = false
	},
	methods: {
		async resolveUserId(authUid: string, email: string): Promise<void> {
			const byAuthUid = await supabase
				.from('users')
				.select('user_id')
				.eq('auth_uid', authUid)
				.maybeSingle()

			if (!byAuthUid.error && byAuthUid.data?.user_id) {
				this.appUserId = byAuthUid.data.user_id
				return
			}

			const byEmail = await supabase
				.from('users')
				.select('user_id')
				.eq('email', email)
				.maybeSingle()

			if (!byEmail.error && byEmail.data?.user_id) {
				this.appUserId = byEmail.data.user_id
			}
		},
		async loadFavoriteItems(): Promise<void> {
			if (!this.appUserId) {
				return
			}

			try {
				this.favoriteItems = await getFavoriteItems(this.appUserId)
			} catch (error) {
				console.error('Erro ao carregar favoritos:', error)
				this.favoriteItems = []
			}
		},
		async removeFavorite(productId: number): Promise<void> {
			if (!this.appUserId) {
				return
			}

			try {
				await removeFavoriteItem(this.appUserId, productId)
				this.favoriteItems = this.favoriteItems.filter((item) => item.product_id !== productId)
			} catch (error) {
				console.error('Erro ao remover favorito:', error)
			}
		},
		goToProduct(productId: number): void {
			this.$router.push({ name: 'product-detail', params: { id: productId } })
		},
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
		},
		handleSignIn(): void {
			this.$router.push({ name: 'sign-in', query: { redirect: '/favoritos' } })
		},
		goHome(): void {
			this.$router.push({ name: 'home' })
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
