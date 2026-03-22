<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader
			class="hidden md:block"
			title="Bem-vindo a MicroLab"
			subtitle=""
		/>
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>
		<AppBanner />
		<ProductSection />
		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppBanner from '../components/layout/AppBanner.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ProductSection from '../components/product/ProductSection.vue'
import { getCurrentSession } from '../services/auth.service'

export default defineComponent({
	name: 'HomeView',
	components: {
		AppHeader,
		AppNavbar,
		AppBanner,
		AppFooter,
		ProductSection
	},
	methods: {
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		async onFavorites(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				this.$router.push({ name: 'sign-in', query: { redirect: '/perfil?tab=favorites' } })
				return
			}

			this.$router.push({ name: 'perfil', query: { tab: 'favorites' } })
		},
		async onLogin(): Promise<void> {
			const session = await getCurrentSession()
			if (session) {
				this.$router.push({ name: 'perfil' })
				return
			}

			this.$router.push({ name: 'sign-in' })
		},
		async onCart(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				this.$router.push({ name: 'sign-in', query: { redirect: '/cart' } })
				return
			}

			this.$router.push({ name: 'cart' })
		}
	}
})
</script>
