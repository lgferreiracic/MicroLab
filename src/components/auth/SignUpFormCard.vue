<template>
	<div class="mx-auto w-full max-w-md">
		<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Cadastro</p>
		<h2 class="m-0 mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Criar conta</h2>
		<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Leva menos de 1 minuto.</p>

		<form class="mt-6 space-y-4" @submit.prevent="$emit('submit')">
			<div>
				<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Nome</label>
				<input
					:value="name"
					type="text"
					required
					placeholder="Seu nome"
					class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
					@input="$emit('update:name', ($event.target as HTMLInputElement).value)"
				/>
			</div>

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
					placeholder="Crie uma senha"
					class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
					@input="$emit('update:password', ($event.target as HTMLInputElement).value)"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirmar senha</label>
				<input
					:value="confirmPassword"
					type="password"
					required
					placeholder="Repita sua senha"
					class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
					@input="$emit('update:confirmPassword', ($event.target as HTMLInputElement).value)"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
	name: 'SignUpFormCard',
	components: {
		RouterLink
	},
	emits: ['update:name', 'update:email', 'update:password', 'update:confirmPassword', 'submit'],
	props: {
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		confirmPassword: {
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
