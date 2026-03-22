<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Checkout" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<h1 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-2xl font-extrabold tracking-tight text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Checkout</h1>

				<div v-if="isLoading" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					Carregando dados do checkout...
				</div>

				<div v-else-if="!isLoggedIn" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Faca login para continuar no checkout.</p>
					<div class="mt-4 text-center">
						<button
							type="button"
							class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
							@click="goToSignIn"
						>
							Fazer login
						</button>
					</div>
				</div>

				<div v-else-if="cartItems.length === 0" class="mt-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Seu carrinho esta vazio. Adicione produtos antes de finalizar a compra.</p>
					<div class="mt-4 text-center">
						<button
							type="button"
							class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
							@click="goHome"
						>
							Ir para produtos
						</button>
					</div>
				</div>

				<div v-else class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div class="space-y-6 lg:col-span-2">
						<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
							<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Endereco de entrega</h2>
							<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Selecione o endereco cadastrado para este pedido.</p>

							<div v-if="addresses.length" class="mt-4 space-y-3">
								<label
									v-for="address in addresses"
									:key="address.address_id"
									class="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition"
									:class="selectedAddressId === address.address_id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'"
								>
									<input v-model="selectedAddressId" :value="address.address_id" type="radio" class="mt-1" />
									<div class="text-sm text-slate-700 dark:text-slate-200">
										<p class="m-0 font-semibold">{{ address.street }}, {{ address.number }}</p>
										<p class="m-0 mt-1">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
										<p class="m-0 mt-1">CEP {{ address.zip_code }}</p>
										<p v-if="address.complement" class="m-0 mt-1 text-slate-500 dark:text-slate-400">Comp.: {{ address.complement }}</p>
									</div>
								</label>
							</div>
							<p v-else class="m-0 mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
								Voce nao possui endereco cadastrado. Adicione em Minha conta para continuar.
							</p>
						</div>

						<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
							<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Pagamento</h2>
							<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
								<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethod === 'pix' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
									<input v-model="paymentMethod" type="radio" value="pix" />
									PIX
								</label>
								<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethod === 'card' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
									<input v-model="paymentMethod" type="radio" value="card" />
									Cartao
								</label>
								<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethod === 'boleto' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
									<input v-model="paymentMethod" type="radio" value="boleto" />
									Boleto
								</label>
							</div>

							<div v-if="paymentMethod === 'card'" class="mt-4 space-y-3">
								<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
									<input
										v-model="cardForm.holderName"
										type="text"
										placeholder="Nome impresso no cartao"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
									/>
									<input
										v-model="cardForm.number"
										type="text"
										placeholder="Numero do cartao"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
									/>
									<input
										v-model="cardForm.expiration"
										type="text"
										placeholder="Validade (MM/AA)"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
									<input
										v-model="cardForm.cvv"
										type="text"
										placeholder="CVV"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
								</div>

								<div>
									<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Parcelamento</label>
									<select
										v-model.number="selectedInstallments"
										class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									>
										<option v-for="installment in installmentOptions" :key="installment" :value="installment">
											{{ installment }}x de {{ formatPrice(cardInstallmentValue) }} sem juros
										</option>
									</select>
								</div>
							</div>

							<p v-if="paymentMethod === 'pix'" class="m-0 mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
								Desconto PIX aplicado: {{ formatPrice(pixDiscountAmount) }}
							</p>
						</div>

						<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
							<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Itens do pedido</h2>
							<div class="mt-4 space-y-3">
								<div v-for="item in cartItems" :key="item.cart_item_id" class="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
									<div class="h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700">
										<img v-if="item.product_image" :src="item.product_image" :alt="item.product_name" class="h-full w-full object-contain p-1" />
									</div>
									<div class="min-w-0 flex-1">
										<p class="m-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</p>
										<p class="m-0 mt-1 text-xs text-slate-600 dark:text-slate-300">Qtd: {{ item.quantity }}</p>
									</div>
									<p class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formatPrice(item.product_price * item.quantity) }}</p>
								</div>
							</div>
						</div>
					</div>

					<div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Resumo</h2>

						<div class="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm dark:border-slate-700">
							<div class="flex justify-between">
								<span class="text-slate-600 dark:text-slate-300">Subtotal</span>
								<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(subtotal) }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-slate-600 dark:text-slate-300">Frete</span>
								<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(shippingCost) }}</span>
							</div>
							<div v-if="paymentMethod === 'pix'" class="flex justify-between">
								<span class="text-emerald-700 dark:text-emerald-300">Desconto PIX (10%)</span>
								<span class="font-medium text-emerald-700 dark:text-emerald-300">- {{ formatPrice(pixDiscountAmount) }}</span>
							</div>
						</div>

						<div class="mt-4 flex justify-between">
							<span class="text-lg font-semibold text-slate-800 dark:text-slate-100">Total</span>
							<span class="text-lg font-bold text-brand-primary">{{ formatPrice(payableTotal) }}</span>
						</div>

						<p v-if="paymentMethod === 'card'" class="m-0 mt-2 text-xs text-slate-600 dark:text-slate-300">
							Pagamento em {{ selectedInstallments }}x de {{ formatPrice(cardInstallmentValue) }} sem juros.
						</p>

						<p v-if="checkoutMessage" class="m-0 mt-4 text-sm text-brand-primary">{{ checkoutMessage }}</p>

						<button
							type="button"
							:disabled="isPlacingOrder || !addresses.length || !selectedAddressId"
							class="mt-6 w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
							@click="placeOrder"
						>
							{{ isPlacingOrder ? 'Finalizando...' : 'Finalizar compra' }}
						</button>
						<button
							type="button"
							class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
							@click="goToCart"
						>
							Voltar ao carrinho
						</button>
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
import { calculateCartTotal, clearCart, getCartItems, type CartItemWithProduct } from '../services/cart.service'
import { createOrderFromCart } from '../services/order.service'

type AddressRecord = {
	address_id: number
	street: string
	number: string
	complement: string | null
	neighborhood: string
	city: string
	state: string
	zip_code: string
}

export default defineComponent({
	name: 'CheckOut',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
	},
	data() {
		return {
			isLoading: true,
			isLoggedIn: false,
			appUserId: null as number | null,
			cartItems: [] as CartItemWithProduct[],
			addresses: [] as AddressRecord[],
			selectedAddressId: null as number | null,
			paymentMethod: 'pix',
			selectedInstallments: 1,
			cardForm: {
				holderName: '',
				number: '',
				expiration: '',
				cvv: ''
			},
			shippingCost: 15,
			isPlacingOrder: false,
			checkoutMessage: ''
		}
	},
	computed: {
		installmentOptions(): number[] {
			return [1, 2, 3, 4, 5, 6, 8, 10, 12]
		},
		subtotal(): number {
			return calculateCartTotal(this.cartItems)
		},
		total(): number {
			return this.subtotal + this.shippingCost
		},
		pixDiscountAmount(): number {
			if (this.paymentMethod !== 'pix') {
				return 0
			}

			return this.total * 0.1
		},
		payableTotal(): number {
			if (this.paymentMethod === 'pix') {
				return this.total - this.pixDiscountAmount
			}

			return this.total
		},
		cardInstallmentValue(): number {
			if (!this.selectedInstallments || this.selectedInstallments <= 0) {
				return this.payableTotal
			}

			return this.payableTotal / this.selectedInstallments
		}
	},
	async created() {
		const session = await getCurrentSession()
		this.isLoggedIn = Boolean(session)

		if (!this.isLoggedIn) {
			this.isLoading = false
			return
		}

		const authUser = await getCurrentAuthUser()
		if (authUser?.email) {
			await this.resolveUserId(authUser.id, authUser.email)
			await Promise.all([this.loadCartItems(), this.loadAddresses()])
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
				this.cartItems = []
				return
			}

			this.cartItems = await getCartItems(this.appUserId)
		},
		async loadAddresses(): Promise<void> {
			if (!this.appUserId) {
				this.addresses = []
				return
			}

			const { data, error } = await supabase
				.from('address')
				.select('address_id, street, number, complement, neighborhood, city, state, zip_code')
				.eq('user_id', this.appUserId)
				.order('address_id', { ascending: false })

			if (error) {
				this.addresses = []
				return
			}

			this.addresses = (data || []) as AddressRecord[]
			if (this.addresses.length && !this.selectedAddressId) {
				this.selectedAddressId = this.addresses[0].address_id
			}
		},
		async placeOrder(): Promise<void> {
			if (!this.appUserId) {
				this.checkoutMessage = 'Nao foi possivel identificar seu usuario.'
				return
			}

			if (!this.cartItems.length) {
				this.checkoutMessage = 'Seu carrinho esta vazio.'
				return
			}

			if (!this.selectedAddressId) {
				this.checkoutMessage = 'Selecione um endereco para continuar.'
				return
			}

			if (this.paymentMethod === 'card') {
				const numberDigits = this.cardForm.number.replace(/\D/g, '')
				const expirationDigits = this.cardForm.expiration.replace(/\D/g, '')
				const cvvDigits = this.cardForm.cvv.replace(/\D/g, '')

				if (!this.cardForm.holderName.trim() || numberDigits.length < 13 || expirationDigits.length < 4 || cvvDigits.length < 3) {
					this.checkoutMessage = 'Preencha os dados do cartao para continuar.'
					return
				}
			}

			this.isPlacingOrder = true
			this.checkoutMessage = ''

			try {
				await createOrderFromCart(this.appUserId, this.cartItems, this.payableTotal)
				await clearCart(this.appUserId)
				this.checkoutMessage = 'Pedido finalizado com sucesso.'
				await this.$router.push({ name: 'my-orders' })
			} catch (error) {
				this.checkoutMessage = error instanceof Error ? error.message : 'Nao foi possivel finalizar a compra.'
			} finally {
				this.isPlacingOrder = false
			}
		},
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
		},
		goToCart(): void {
			this.$router.push({ name: 'cart' })
		},
		goToSignIn(): void {
			this.$router.push({ name: 'sign-in', query: { redirect: '/checkout' } })
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
