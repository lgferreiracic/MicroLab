<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Carrinho de compras" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<h1 class="m-0 text-2xl font-semibold text-slate-800 dark:text-slate-100">Carrinho</h1>
				<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Resumo dos itens adicionados ao carrinho.</p>

				<div v-if="!isLoggedIn" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Faça login para visualizar seu carrinho.</p>
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
					<p class="m-0 text-sm text-slate-600 dark:text-slate-300">Carregando carrinho...</p>
				</div>

<div v-else-if="cartItems.length === 0" class="mt-8">
				<CartEmptyState @continue-shopping="goHome" />
				</div>

				<div v-else class="mt-8">
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<CartItemsList
							:cart-items="cartItems"
							@quantity-increase="increaseQuantity"
							@quantity-decrease="decreaseQuantity"
							@item-remove="removeItem"
						/>
						<CartSummary
							:subtotal="subtotal"
							:shipping-cost="shippingCost"
							:tax-cost="taxCost"
							:has-items="cartItems.length > 0"
							@checkout="goToCheckout"
							@continue-shopping="goHome"
							@clear-cart="clearAllItems"
						/>
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
import CartItemsList from '../components/cart/CartItemsList.vue'
import CartSummary from '../components/cart/CartSummary.vue'
import CartEmptyState from '../components/cart/CartEmptyState.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'
import { getCartItems, calculateCartTotal, updateCartItemQuantity, removeCartItem, clearCart, type CartItemWithProduct } from '../services/cart.service'

export default defineComponent({
	name: 'CartView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter,
		CartItemsList,
		CartSummary,
		CartEmptyState
	},
	data() {
		return {
			cartItems: [] as CartItemWithProduct[],
			isLoggedIn: false,
			isLoading: true,
			appUserId: null as number | null,
			shippingCost: 15.00,
			taxCost: 0
		}
	},
	computed: {
		subtotal(): number {
			return calculateCartTotal(this.cartItems)
		},
		total(): number {
			return this.subtotal + this.shippingCost + this.taxCost
		}
	},
	async created() {
		const session = await getCurrentSession()
		this.isLoggedIn = !!session

		if (this.isLoggedIn) {
			const authUser = await getCurrentAuthUser()
			if (authUser?.email) {
				await this.resolveUserId(authUser.id, authUser.email)
				await this.loadCartItems()
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
		async loadCartItems(): Promise<void> {
			if (!this.appUserId) {
				return
			}

			try {
				this.cartItems = await getCartItems(this.appUserId)
			} catch (error) {
				console.error('Erro ao carregar carrinho:', error)
			}
		},
		async increaseQuantity(item: CartItemWithProduct): Promise<void> {
			try {
				await updateCartItemQuantity(item.cart_item_id, item.quantity + 1)
				item.quantity += 1
			} catch (error) {
				console.error('Erro ao aumentar quantidade:', error)
			}
		},
		async decreaseQuantity(item: CartItemWithProduct): Promise<void> {
			if (item.quantity <= 1) {
				return
			}

			try {
				await updateCartItemQuantity(item.cart_item_id, item.quantity - 1)
				item.quantity -= 1
			} catch (error) {
				console.error('Erro ao diminuir quantidade:', error)
			}
		},
		async removeItem(item: CartItemWithProduct): Promise<void> {
			try {
				await removeCartItem(item.cart_item_id)
				this.cartItems = this.cartItems.filter(i => i.cart_item_id !== item.cart_item_id)
			} catch (error) {
				console.error('Erro ao remover item:', error)
			}
		},
		async clearAllItems(): Promise<void> {
			if (!this.appUserId || !confirm('Tem certeza que deseja limpar todo o carrinho?')) {
				return
			}

			try {
				await clearCart(this.appUserId)
				this.cartItems = []
			} catch (error) {
				console.error('Erro ao limpar carrinho:', error)
			}
		},
		handleSignIn(): void {
			this.$router.push({ name: 'sign-in', query: { redirect: '/cart' } })
		},
		goHome(): void {
			this.$router.push({ name: 'home' })
		},
		goToCheckout(): void {
			this.$router.push({ name: 'checkout' })
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
