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
						<CheckoutAddressSelector v-model="selectedAddressId" :addresses="addresses" />
						<CheckoutPaymentMethod
							:payment-method="paymentMethod"
							:selected-installments="selectedInstallments"
							:installment-options="installmentOptions"
							:card-form="cardForm"
							:card-installment-value="cardInstallmentValue"
							:pix-discount-amount="pixDiscountAmount"
							@update:payment-method="paymentMethod = $event"
							@update:selected-installments="selectedInstallments = $event"
							@update:card-form="cardForm = $event"
						/>
						<CheckoutOrderItems :cart-items="cartItems" />
					</div>
					<CheckoutOrderSummary
						:subtotal="subtotal"
						:shipping-cost="shippingCost"
						:pix-discount-amount="pixDiscountAmount"
						:payable-total="payableTotal"
						:payment-method="paymentMethod"
						:selected-installments="selectedInstallments"
						:card-installment-value="cardInstallmentValue"
						:checkout-message="checkoutMessage"
						:is-placing-order="isPlacingOrder"
						:has-addresses="Boolean(addresses.length)"
						:selected-address-id="selectedAddressId"
						@place-order="placeOrder"
						@back-to-cart="goToCart"
					/>
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
import CheckoutAddressSelector from '../components/checkout/CheckoutAddressSelector.vue'
import CheckoutPaymentMethod from '../components/checkout/CheckoutPaymentMethod.vue'
import CheckoutOrderItems from '../components/checkout/CheckoutOrderItems.vue'
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary.vue'
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
		AppFooter,
		CheckoutAddressSelector,
		CheckoutPaymentMethod,
		CheckoutOrderItems,
		CheckoutOrderSummary
	},
	data() {
		return {
			isLoading: true,
			isLoggedIn: false,
			appUserId: null as number | null,
			cartItems: [] as CartItemWithProduct[],
			addresses: [] as AddressRecord[],
			selectedAddressId: null as number | null,
			paymentMethod: 'pix' as 'pix' | 'card' | 'boleto',
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
