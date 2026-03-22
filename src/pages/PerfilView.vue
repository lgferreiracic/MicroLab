<template>
	<section class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-12 dark:bg-slate-950">
		<div class="mx-auto w-full max-w-7xl">
			<h1 class="m-0 text-2xl font-semibold text-slate-800 dark:text-slate-100">Perfil</h1>
			<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Dados da conta, endereco e preferencias.</p>
			<button
				type="button"
				class="mt-5 h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary"
				@click="handleSignOut"
			>
				Sair da conta
			</button>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { signOut } from '../lib/auth'

export default defineComponent({
	name: 'PerfilView',
	methods: {
		handleSignOut(): void {
			signOut()
			this.$router.push({ name: 'sign-in' })
		}
	}
})
</script>
