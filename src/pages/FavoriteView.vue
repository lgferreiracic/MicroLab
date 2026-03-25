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

				<FavoriteLoginPrompt v-if="!isLoggedIn" class="mt-8" @sign-in="handleSignIn" />

				<div v-else-if="isLoading" class="mt-8 text-center">
					<p class="m-0 text-sm text-slate-600 dark:text-slate-300">Carregando favoritos...</p>
				</div>

				<FavoriteEmptyState v-else-if="favoriteItems.length === 0" class="mt-8" @explore-products="goHome" />

				<FavoriteItemsGrid
					v-else
					class="mt-8"
					:favorite-items="favoriteItems"
					@go-to-product="goToProduct"
					@remove-favorite="removeFavorite"
				/>
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
import FavoriteLoginPrompt from '../components/favorite/FavoriteLoginPrompt.vue'
import FavoriteEmptyState from '../components/favorite/FavoriteEmptyState.vue'
import FavoriteItemsGrid from '../components/favorite/FavoriteItemsGrid.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'
import { getFavoriteItems, removeFavoriteItem, type FavoriteItemWithProduct } from '../services/favorite.service'

export default defineComponent({
	name: 'FavoriteView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter,
		FavoriteLoginPrompt,
		FavoriteEmptyState,
		FavoriteItemsGrid
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
