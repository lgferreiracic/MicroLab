<template>
	<div class="min-h-screen bg-slate-100 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Bem-vindo a MicroLab" subtitle="" />

		<section class="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
			<div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-tertiary/30 blur-3xl"></div>
			<div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-primary/25 blur-3xl"></div>

			<div class="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2 dark:bg-slate-900">
			<div class="hidden bg-linear-to-br from-brand-primary via-brand-secondary to-brand-tertiary p-10 text-white lg:block">
				<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">MicroLab</p>
				<h1 class="m-0 mt-3 text-3xl font-bold">Sua bancada começa aqui</h1>
				<p class="m-0 mt-4 text-sm leading-6 text-white/90">
					Acesse sua conta para acompanhar pedidos, gerenciar favoritos e explorar ofertas exclusivas.
				</p>
			</div>

			<div class="p-6 sm:p-10">
				<div class="mx-auto w-full max-w-md">
					<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Acesso</p>
					<h2 class="m-0 mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Entrar na conta</h2>
					<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Use seu e-mail para continuar.</p>

					<form class="mt-6 space-y-4" @submit.prevent="handleSignIn">
						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">E-mail</label>
							<input
								v-model="email"
								type="email"
								required
								placeholder="voce@empresa.com"
								class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Senha</label>
							<input
								v-model="password"
								type="password"
								required
								placeholder="••••••••"
								class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
							/>
						</div>

						<p v-if="errorMessage" class="m-0 text-sm font-medium text-red-500">{{ errorMessage }}</p>

						<button
							type="submit"
							class="h-11 w-full rounded-lg bg-brand-primary text-sm font-semibold text-white transition hover:bg-brand-secondary"
						>
							Entrar
						</button>
					</form>

					<p class="m-0 mt-4 text-sm text-slate-600 dark:text-slate-300">
						Nao tem conta?
						<RouterLink :to="{ name: 'sign-up' }" class="font-semibold text-brand-primary hover:underline">
							Criar conta
						</RouterLink>
					</p>
				</div>
			</div>
			</div>
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { isAuthenticated, signIn } from '../lib/auth'

export default defineComponent({
	name: 'SignInView',
	components: {
		RouterLink,
		AppHeader,
		AppFooter
	},
	data() {
		return {
			email: '',
			password: '',
			errorMessage: ''
		}
	},
	created() {
		if (isAuthenticated()) {
			this.$router.replace({ name: 'perfil' })
		}
	},
	methods: {
		handleSignIn(): void {
			if (!this.email || !this.password) {
				this.errorMessage = 'Preencha e-mail e senha para entrar.'
				return
			}

			this.errorMessage = ''
			signIn({
				name: this.email.split('@')[0] || 'Usuario',
				email: this.email
			})

			const redirect = typeof this.$route.query.redirect === 'string' ? this.$route.query.redirect : '/perfil'
			this.$router.push(redirect)
		}
	}
})
</script>
