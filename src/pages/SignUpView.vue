<template>
	<div class="min-h-screen bg-slate-100 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Bem-vindo a MicroLab" subtitle="" />

		<AuthSplitLayout
			title="Crie sua conta e acelere seus projetos"
			description="Cadastre-se para salvar favoritos, acompanhar compras e acessar novidades da loja."
			left-gradient-class="bg-linear-to-br from-brand-tertiary via-brand-secondary to-brand-primary"
		>
			<SignUpFormCard
				:name="name"
				:email="email"
				:password="password"
				:confirm-password="confirmPassword"
				:error-message="errorMessage"
				:is-submitting="isSubmitting"
				@update:name="name = $event"
				@update:email="email = $event"
				@update:password="password = $event"
				@update:confirm-password="confirmPassword = $event"
				@submit="handleSignUp"
			/>
		</AuthSplitLayout>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import AuthSplitLayout from '../components/auth/AuthSplitLayout.vue'
import SignUpFormCard from '../components/auth/SignUpFormCard.vue'
import { getCurrentSession } from '../services/auth.service'
import { createUserAccount } from '../services/user-creation.service'

export default defineComponent({
	name: 'SignUpView',
	components: {
		AppHeader,
		AppFooter,
		AuthSplitLayout,
		SignUpFormCard
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
