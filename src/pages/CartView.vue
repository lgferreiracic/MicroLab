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

				<div v-else-if="cartItems.length === 0" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Seu carrinho está vazio.</p>
					<div class="mt-4 text-center">
						<button
							type="button"
							class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
							@click="goHome"
						>
							Continuar comprando
						</button>
					</div>
				</div>

				<div v-else class="mt-8">
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<!-- Itens do carrinho -->
						<div class="lg:col-span-2 space-y-4">
							<div
								v-for="item in cartItems"
								:key="item.cart_item_id"
								class="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
							>
								<!-- Imagem do produto -->
								<div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
									<img
										v-if="item.product_image"
										:src="item.product_image"
										:alt="item.product_name"
										class="h-full w-full object-cover"
									/>
									<div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">
										Sem imagem
									</div>
								</div>

								<!-- Detalhes do produto -->
								<div class="flex flex-1 flex-col justify-between">
									<div>
										<h3 class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</h3>
										<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">
											{{ formatPrice(item.product_price) }}
										</p>
									</div>

									<!-- Quantidade e remover -->
									<div class="mt-2 flex items-center gap-3">
										<div class="flex items-center gap-2">
											<button
												type="button"
												class="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
												:disabled="item.quantity === 1"
												@click="decreaseQuantity(item)"
											>
												−
											</button>
											<span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
											<button
												type="button"
												class="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
												@click="increaseQuantity(item)"
											>
												+
											</button>
										</div>

										<button
											type="button"
											class="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
											@click="removeItem(item)"
										>
											Remover
										</button>
									</div>
								</div>

								<!-- Subtotal -->
								<div class="flex flex-col items-end justify-between">
									<span class="text-sm font-semibold text-slate-800 dark:text-slate-100">
										{{ formatPrice(item.product_price * item.quantity) }}
									</span>
								</div>
							</div>
						</div>

						<!-- Resumo do carrinho -->
						<div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
							<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Resumo</h2>

							<div class="mt-4 space-y-3 border-b border-slate-200 pb-4 dark:border-slate-700">
								<div class="flex justify-between text-sm">
									<span class="text-slate-600 dark:text-slate-300">Subtotal</span>
									<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(subtotal) }}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-slate-600 dark:text-slate-300">Envio</span>
									<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(shippingCost) }}</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-slate-600 dark:text-slate-300">Impostos</span>
									<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(taxCost) }}</span>
								</div>
							</div>

							<div class="mt-4 flex justify-between">
								<span class="text-lg font-semibold text-slate-800 dark:text-slate-100">Total</span>
								<span class="text-lg font-bold text-brand-primary">{{ formatPrice(total) }}</span>
							</div>

							<div class="mt-6 space-y-2">
								<button
									type="button"
									class="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary"
									@click="goToCheckout"
								>
									Ir ao checkout
								</button>
								<button
									type="button"
									class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
									@click="goHome"
								>
									Continuar comprando
								</button>
							</div>

							<button
								v-if="cartItems.length > 0"
								type="button"
								class="mt-4 w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
								@click="clearAllItems"
							>
								Limpar carrinho
							</button>
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
import { getCartItems, calculateCartTotal, updateCartItemQuantity, removeCartItem, clearCart, CartItemWithProduct } from '../services/cart.service'

export default defineComponent({
	name: 'CartView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
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
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
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
