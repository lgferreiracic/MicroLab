<template>
	<div class="flex flex-col rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<div>
			<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Meus pedidos</h2>
			<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Acompanhe status e historico de compras em uma tela dedicada.</p>
		</div>
		<div class="flex-1"></div>
		<button
			type="button"
			class="mt-4 h-10 w-fit rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-secondary"
			@click="$emit('go-orders')"
		>
			Ver meus pedidos
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileOrdersCard',
	emits: ['go-orders']
})
</script>
