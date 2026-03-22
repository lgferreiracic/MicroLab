<template>
	<div class="flex h-full flex-col justify-center rounded-lg p-3">
		<img
			:src="product.image"
			:alt="`${product.name} card`"
			class="h-40 w-full rounded-md object-cover"
		/>

		<div class="mt-3 min-w-0 text-center">
			<p class="m-0 text-base font-semibold text-slate-800 dark:text-slate-100">{{ product.name }}</p>
			<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">Preco total: {{ formatCurrency(product.price) }}</p>
			<p class="m-0 text-sm text-slate-600 dark:text-slate-300">
				{{ product.installments }}x sem juros de {{ formatCurrency(product.price / product.installments) }}
			</p>
			<p class="m-0 text-sm font-semibold text-brand-primary">
				No pix: {{ formatCurrency(getPixPrice(product.price)) }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
	name: 'ProductCard',
	props: {
		product: {
			type: Object as PropType<{
				id: number
				name: string
				image: string
				price: number
				installments: number
			}>,
			required: true
		}
	},
	methods: {
		formatCurrency(value: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(value)
		},
		getPixPrice(value: number): number {
			return value * 0.9
		}
	}
})
</script>
