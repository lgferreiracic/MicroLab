<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Meus pedidos" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<div v-if="isLoading" class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					Carregando pedidos...
				</div>

				<div v-else-if="!orders.length" class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
					<h1 class="m-0 text-xl font-semibold text-slate-800 dark:text-slate-100">Historico de pedidos</h1>
					<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Voce ainda nao possui pedidos finalizados.</p>
					<button
						type="button"
						class="mt-5 h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary"
						@click="$router.push({ name: 'home' })"
					>
						Ir para produtos
					</button>
				</div>

				<div v-else class="space-y-4">
					<div
						v-for="order in orders"
						:key="order.order_id"
						class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
					>
						<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
							<div>
								<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Pedido #{{ order.order_id }}</h2>
								<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">{{ formatDate(order.created_at) }}</p>
							</div>
							<div class="text-right">
								<p class="m-0 text-xs font-semibold uppercase tracking-wider text-brand-primary">{{ order.status }}</p>
								<p class="m-0 mt-1 text-base font-bold text-slate-800 dark:text-slate-100">{{ formatPrice(order.total_price) }}</p>
							</div>
						</div>

						<div class="mt-4 space-y-3">
							<div v-for="item in order.items" :key="item.order_item_id" class="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
								<div class="h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700">
									<img v-if="item.product_image" :src="item.product_image" :alt="item.product_name" class="h-full w-full object-contain p-1" />
								</div>
								<div class="min-w-0 flex-1">
									<p class="m-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</p>
									<p class="m-0 mt-1 text-xs text-slate-600 dark:text-slate-300">Qtd: {{ item.quantity }}</p>
								</div>
								<p class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formatPrice(item.unit_price * item.quantity) }}</p>
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
import { getUserOrders, type UserOrder } from '../services/order.service'

export default defineComponent({
	name: 'MyOrdersView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
	},
	data() {
		return {
			orders: [] as UserOrder[],
			isLoading: true,
			appUserId: null as number | null
		}
	},
	async created() {
		const authUser = await getCurrentAuthUser()
		if (authUser?.email) {
			await this.resolveUserId(authUser.id, authUser.email)
			await this.loadOrders()
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
		async loadOrders(): Promise<void> {
			if (!this.appUserId) {
				this.orders = []
				return
			}

			this.orders = await getUserOrders(this.appUserId)
		},
		formatPrice(value: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(value)
		},
		formatDate(value: string): string {
			return new Date(value).toLocaleString('pt-BR')
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
