<template>
	<div>
		<div class="mb-4 flex items-center justify-between">
			<p class="m-0 text-sm text-slate-600 dark:text-slate-300">{{ favoriteItems.length }} itens salvos</p>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			<div
				v-for="item in favoriteItems"
				:key="item.product_id"
				class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
			>
				<div class="h-48 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
					<img
						v-if="item.product_image"
						:src="item.product_image"
						:alt="item.product_name"
						class="h-full w-full object-contain p-2"
					/>
					<div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">
						Sem imagem
					</div>
				</div>

				<div class="mt-3">
					<h3 class="m-0 text-base font-semibold text-slate-800 dark:text-slate-100">{{ item.product_name }}</h3>
					<p class="m-0 mt-1 text-sm font-semibold text-brand-primary">{{ formatPrice(item.product_price) }}</p>
					<p class="m-0 mt-1 text-xs" :class="item.product_stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
						{{ item.product_stock > 0 ? 'Em estoque' : 'Indisponivel' }}
					</p>
				</div>

				<div class="mt-4 flex gap-2">
					<button
						type="button"
						class="flex-1 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-secondary"
						@click="$emit('go-to-product', item.product_id)"
					>
						Ver produto
					</button>
					<button
						type="button"
						class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
						@click="$emit('remove-favorite', item.product_id)"
					>
						Remover
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { FavoriteItemWithProduct } from '../../services/favorite.service'

export default defineComponent({
	name: 'FavoriteItemsGrid',
	emits: ['go-to-product', 'remove-favorite'],
	props: {
		favoriteItems: {
			type: Array as PropType<FavoriteItemWithProduct[]>,
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
