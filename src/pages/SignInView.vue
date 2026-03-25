<template>
	<div class="min-h-screen bg-slate-100 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Bem-vindo a MicroLab" subtitle="" />

		<AuthSplitLayout
			title="Sua bancada começa aqui"
			description="Acesse sua conta para acompanhar pedidos, gerenciar favoritos e explorar ofertas exclusivas."
			left-gradient-class="bg-linear-to-br from-brand-primary via-brand-secondary to-brand-tertiary"
		>
			<SignInFormCard
				:email="email"
				:password="password"
				:error-message="errorMessage"
				:is-submitting="isSubmitting"
				@update:email="email = $event"
				@update:password="password = $event"
				@submit="handleSignIn"
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
import SignInFormCard from '../components/auth/SignInFormCard.vue'
import { getCurrentSession, signInWithEmail } from '../services/auth.service'

export default defineComponent({
	name: 'SignInView',
	components: {
		AppHeader,
		AppFooter,
		AuthSplitLayout,
		SignInFormCard
	},
	data() {
		return {
			email: '',
			password: '',
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
		async handleSignIn(): Promise<void> {
			if (!this.email || !this.password) {
				this.errorMessage = 'Preencha e-mail e senha para entrar.'
				return
			}

			this.errorMessage = ''
			this.isSubmitting = true

			try {
				await signInWithEmail({
					email: this.email,
					password: this.password
				})

				const redirect = typeof this.$route.query.redirect === 'string' ? this.$route.query.redirect : '/perfil'
				await this.$router.push(redirect)
			} catch (error) {
				this.errorMessage = error instanceof Error ? error.message : 'Nao foi possivel autenticar no momento.'
			} finally {
				this.isSubmitting = false
			}
		}
	}
})
</script>
