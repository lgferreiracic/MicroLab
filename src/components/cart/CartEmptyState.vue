<template>
	<div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
		<p class="m-0 text-center text-sm text-slate-600 dark:text-slate-300">Seu carrinho está vazio.</p>
		<div class="mt-4 text-center">
			<button
				type="button"
				class="inline-block rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
				@click="$emit('continue-shopping')"
			>
				Continuar comprando
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CartEmptyState',
	emits: ['continue-shopping']
})
</script>
