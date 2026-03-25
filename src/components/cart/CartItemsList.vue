<template>
	<div class="lg:col-span-2 space-y-4">
		<div
			v-for="item in cartItems"
			:key="item.cart_item_id"
			class="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
		>
			<!-- Imagem do produto -->
			<div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
				<img
					v-if="item.product_image"
					:src="item.product_image"
					:alt="item.product_name"
					class="h-full w-full object-cover"
				/>
				<div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">
					Sem imagem
				</div>
			</div>

			<!-- Detalhes do produto -->
			<div class="flex flex-1 flex-col justify-between">
				<div>
					<h3 class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</h3>
					<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">
						{{ formatPrice(item.product_price) }}
					</p>
				</div>

				<!-- Quantidade e remover -->
				<div class="mt-2 flex items-center gap-3">
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
							:disabled="item.quantity === 1"
							@click="$emit('quantity-decrease', item)"
						>
							−
						</button>
						<span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
						<button
							type="button"
							class="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
							@click="$emit('quantity-increase', item)"
						>
							+
						</button>
					</div>

					<button
						type="button"
						class="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
						@click="$emit('item-remove', item)"
					>
						Remover
					</button>
				</div>
			</div>

			<!-- Subtotal -->
			<div class="flex flex-col items-end justify-between">
				<span class="text-sm font-semibold text-slate-800 dark:text-slate-100">
					{{ formatPrice(item.product_price * item.quantity) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { CartItemWithProduct } from '../../services/cart.service'

export default defineComponent({
	name: 'CartItemsList',
	emits: ['quantity-increase', 'quantity-decrease', 'item-remove'],
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
