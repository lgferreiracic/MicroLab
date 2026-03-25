<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<div class="flex items-start justify-between gap-4">
			<div class="flex-1">
				<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Dados da conta</h2>
				<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
						<p class="m-0 text-xs text-slate-500 dark:text-slate-400">Nome</p>
						<p class="m-0 mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{{ displayName }}</p>
					</div>
					<div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
						<p class="m-0 text-xs text-slate-500 dark:text-slate-400">E-mail</p>
						<p class="m-0 mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{{ displayEmail }}</p>
					</div>
				</div>
			</div>
			<button
				type="button"
				class="mt-0 h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
				@click="$emit('sign-out')"
			>
				Sair
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileAccountCard',
	emits: ['sign-out'],
	props: {
		displayName: {
			type: String,
			required: true
		},
		displayEmail: {
			type: String,
			required: true
		}
	}
})
</script>
