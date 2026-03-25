<template>
	<div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Resumo</h2>

		<div class="mt-4 space-y-3 border-b border-slate-200 pb-4 dark:border-slate-700">
			<div class="flex justify-between text-sm">
				<span class="text-slate-600 dark:text-slate-300">Subtotal</span>
				<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(subtotal) }}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-600 dark:text-slate-300">Envio</span>
				<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(shippingCost) }}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-slate-600 dark:text-slate-300">Impostos</span>
				<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(taxCost) }}</span>
			</div>
		</div>

		<div class="mt-4 flex justify-between">
			<span class="text-lg font-semibold text-slate-800 dark:text-slate-100">Total</span>
			<span class="text-lg font-bold text-brand-primary">{{ formatPrice(total) }}</span>
		</div>

		<div class="mt-6 space-y-2">
			<button
				type="button"
				class="w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary"
				@click="$emit('checkout')"
			>
				Ir ao checkout
			</button>
			<button
				type="button"
				class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
				@click="$emit('continue-shopping')"
			>
				Continuar comprando
			</button>
		</div>

		<button
			v-if="hasItems"
			type="button"
			class="mt-4 w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
			@click="$emit('clear-cart')"
		>
			Limpar carrinho
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CartSummary',
	emits: ['checkout', 'continue-shopping', 'clear-cart'],
	props: {
		subtotal: {
			type: Number,
			required: true
		},
		shippingCost: {
			type: Number,
			required: true
		},
		taxCost: {
			type: Number,
			required: true
		},
		hasItems: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		total(): number {
			return this.subtotal + this.shippingCost + this.taxCost
		}
	},
	methods: {
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
		}
	}
})
</script>
