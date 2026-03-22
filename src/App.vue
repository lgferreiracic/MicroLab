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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppNavbar from './components/layout/AppNavbar.vue'

export default defineComponent({
	name: 'App',
	components: {
		AppHeader,
		AppNavbar
	},
	methods: {
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		onFavorites(): void {
			console.log('favorites')
		},
		onLogin(): void {
			console.log('login')
		},
		onCart(): void {
			console.log('cart')
		}
	}
})
</script>
