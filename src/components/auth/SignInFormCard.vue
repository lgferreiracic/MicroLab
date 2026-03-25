<template>
	<div class="mx-auto w-full max-w-md">
		<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Acesso</p>
		<h2 class="m-0 mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Entrar na conta</h2>
		<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Use seu e-mail para continuar.</p>

		<form class="mt-6 space-y-4" @submit.prevent="$emit('submit')">
			<div>
				<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">E-mail</label>
				<input
					:value="email"
					type="email"
					required
					placeholder="voce@empresa.com"
					class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
					@input="$emit('update:email', ($event.target as HTMLInputElement).value)"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Senha</label>
				<input
					:value="password"
					type="password"
					required
					placeholder="••••••••"
					class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
					@input="$emit('update:password', ($event.target as HTMLInputElement).value)"
				/>
			</div>

			<p v-if="errorMessage" class="m-0 text-sm font-medium text-red-500">{{ errorMessage }}</p>

			<button
				type="submit"
				:disabled="isSubmitting"
				class="h-11 w-full rounded-lg bg-brand-primary text-sm font-semibold text-white transition hover:bg-brand-secondary"
			>
				{{ isSubmitting ? 'Entrando...' : 'Entrar' }}
			</button>
		</form>

		<p class="m-0 mt-4 text-sm text-slate-600 dark:text-slate-300">
			Nao tem conta?
			<RouterLink :to="{ name: 'sign-up' }" class="font-semibold text-brand-primary hover:underline">
				Criar conta
			</RouterLink>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
	name: 'SignInFormCard',
	components: {
		RouterLink
	},
	emits: ['update:email', 'update:password', 'submit'],
	props: {
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		errorMessage: {
			type: String,
			required: true
		},
		isSubmitting: {
			type: Boolean,
			required: true
		}
	}
})
</script>
