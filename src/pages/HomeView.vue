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
		onFavorites(): void {
			this.$router.push({ name: 'perfil', query: { tab: 'favorites' } })
		},
		onLogin(): void {
			this.$router.push({ name: 'perfil' })
		},
		onCart(): void {
			this.$router.push({ name: 'cart' })
		}
	}
})
</script>
