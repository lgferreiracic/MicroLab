<template>
	<div class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<div>
			<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Segurança</h2>
			<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Altere sua senha da conta.</p>

			<div class="mt-4 space-y-2">
				<input :value="currentPassword" type="password" placeholder="Senha atual" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:currentPassword', ($event.target as HTMLInputElement).value)" />

				<div v-if="isPasswordValidated" class="space-y-2">
					<input :value="newPassword" type="password" placeholder="Nova senha" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:newPassword', ($event.target as HTMLInputElement).value)" />
					<input :value="confirmNewPassword" type="password" placeholder="Confirmar nova senha" class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:confirmNewPassword', ($event.target as HTMLInputElement).value)" />
				</div>
			</div>

			<p v-if="passwordMessage" class="m-0 mt-2 text-sm text-brand-primary">{{ passwordMessage }}</p>
		</div>

		<div class="mt-4 space-y-2">
			<button
				type="button"
				:disabled="isUpdatingPassword || !currentPassword"
				class="h-10 w-fit rounded-lg px-6 text-sm font-semibold text-white transition"
				:class="isPasswordValidated ? 'bg-brand-primary hover:bg-brand-secondary' : 'bg-slate-500 hover:bg-slate-600'"
				@click="$emit(isPasswordValidated ? 'update-password' : 'validate-password')"
			>
				{{ isUpdatingPassword ? 'Processando...' : (isPasswordValidated ? 'Alterar senha' : 'Validar senha') }}
			</button>

			<button
				v-if="isPasswordValidated"
				type="button"
				class="h-10 w-fit rounded-lg bg-slate-200 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
				@click="$emit('cancel-password')"
			>
				Cancelar
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileSecurityCard',
	emits: [
		'update:currentPassword',
		'update:newPassword',
		'update:confirmNewPassword',
		'validate-password',
		'update-password',
		'cancel-password'
	],
	props: {
		currentPassword: {
			type: String,
			required: true
		},
		newPassword: {
			type: String,
			required: true
		},
		confirmNewPassword: {
			type: String,
			required: true
		},
		isPasswordValidated: {
			type: Boolean,
			required: true
		},
		isUpdatingPassword: {
			type: Boolean,
			required: true
		},
		passwordMessage: {
			type: String,
			required: true
		}
	}
})
</script>
