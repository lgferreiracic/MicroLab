<template>
	<div class="min-h-screen bg-slate-100 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Bem-vindo a MicroLab" subtitle="" />

		<section class="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
			<div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-tertiary/30 blur-3xl"></div>
			<div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-primary/25 blur-3xl"></div>

			<div class="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2 dark:bg-slate-900">
			<div class="hidden bg-linear-to-br from-brand-tertiary via-brand-secondary to-brand-primary p-10 text-white lg:block">
				<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">MicroLab</p>
				<h1 class="m-0 mt-3 text-3xl font-bold">Crie sua conta e acelere seus projetos</h1>
				<p class="m-0 mt-4 text-sm leading-6 text-white/90">
					Cadastre-se para salvar favoritos, acompanhar compras e acessar novidades da loja.
				</p>
			</div>

			<div class="p-6 sm:p-10">
				<div class="mx-auto w-full max-w-md">
					<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Cadastro</p>
					<h2 class="m-0 mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Criar conta</h2>
					<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Leva menos de 1 minuto.</p>

					<form class="mt-6 space-y-4" @submit.prevent="handleSignUp">
						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Nome</label>
							<input
								v-model="name"
								type="text"
								required
								placeholder="Seu nome"
								class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
							/>
						</div>

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
								placeholder="Crie uma senha"
								class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirmar senha</label>
							<input
								v-model="confirmPassword"
								type="password"
								required
								placeholder="Repita sua senha"
								class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
							/>
						</div>

						<p v-if="errorMessage" class="m-0 text-sm font-medium text-red-500">{{ errorMessage }}</p>

						<button
							type="submit"
							:disabled="isSubmitting"
							class="h-11 w-full rounded-lg bg-brand-primary text-sm font-semibold text-white transition hover:bg-brand-secondary"
						>
							{{ isSubmitting ? 'Criando conta...' : 'Criar conta' }}
						</button>
					</form>

					<p class="m-0 mt-4 text-sm text-slate-600 dark:text-slate-300">
						Ja tem conta?
						<RouterLink :to="{ name: 'sign-in' }" class="font-semibold text-brand-primary hover:underline">
							Fazer login
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
import { getCurrentSession } from '../services/auth.service'
import { createUserAccount } from '../services/user-creation.service'

export default defineComponent({
	name: 'SignUpView',
	components: {
		RouterLink,
		AppHeader,
		AppFooter
	},
	data() {
		return {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			errorMessage: '',
			isSubmitting: false
		}
	},
	async created() {
		const session = await getCurrentSession()
		if (session) {
			await this.$router.replace({ name: 'perfil' })
		}
	},
	methods: {
		async handleSignUp(): Promise<void> {
			if (!this.name || !this.email || !this.password || !this.confirmPassword) {
				this.errorMessage = 'Preencha todos os campos para criar a conta.'
				return
			}

			if (this.password !== this.confirmPassword) {
				this.errorMessage = 'As senhas nao conferem.'
				return
			}

			this.errorMessage = ''
			this.isSubmitting = true

			try {
				const result = await createUserAccount({
					name: this.name,
					email: this.email,
					password: this.password
				})

				if (result.requiresEmailConfirmation) {
					this.errorMessage = 'Conta criada. Verifique seu e-mail para confirmar o cadastro antes de entrar.'
					await this.$router.push({ name: 'sign-in' })
					return
				}

				const redirect = typeof this.$route.query.redirect === 'string' ? this.$route.query.redirect : '/perfil'
				await this.$router.push(redirect)
			} catch (error) {
				this.errorMessage = error instanceof Error ? error.message : 'Nao foi possivel criar sua conta agora.'
			} finally {
				this.isSubmitting = false
			}
		}
	}
})
</script>
