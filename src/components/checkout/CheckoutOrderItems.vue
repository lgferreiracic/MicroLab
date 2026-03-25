<template>
	<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Itens do pedido</h2>
		<div class="mt-4 space-y-3">
			<div v-for="item in cartItems" :key="item.cart_item_id" class="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
				<div class="h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700">
					<img v-if="item.product_image" :src="item.product_image" :alt="item.product_name" class="h-full w-full object-contain p-1" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="m-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</p>
					<p class="m-0 mt-1 text-xs text-slate-600 dark:text-slate-300">Qtd: {{ item.quantity }}</p>
				</div>
				<p class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formatPrice(item.product_price * item.quantity) }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { CartItemWithProduct } from '../../services/cart.service'

export default defineComponent({
	name: 'CheckoutOrderItems',
	props: {
		cartItems: {
			type: Array as PropType<CartItemWithProduct[]>,
			required: true
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
