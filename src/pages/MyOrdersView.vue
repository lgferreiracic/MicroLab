<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Meus pedidos" subtitle="Acompanhe o status das suas compras" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
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
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { getCurrentSession } from '../services/auth.service'

export default defineComponent({
	name: 'MyOrdersView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
	},
	methods: {
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
