<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
			<div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-white">
				<img
					v-if="productImage"
					:src="productImage"
					:alt="product.name"
					class="h-full max-h-105 w-full object-contain"
				/>
				<div v-else class="flex h-80 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
					Imagem indisponivel
				</div>
			</div>

			<div class="rounded-xl border border-slate-200/80 bg-linear-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/70">
				<div class="flex items-start justify-between gap-3">
					<p class="m-0 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-primary w-fit">Produto</p>
					<div class="flex flex-col items-end gap-2">
						<p v-if="product.category?.name" class="m-0 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
							Categoria: {{ product.category.name }}
						</p>
						<span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
							{{ product.stock > 0 ? 'Em estoque' : 'Indisponivel' }}
						</span>
					</div>
				</div>

				<h1 class="m-0 mt-3 text-center text-3xl font-extrabold tracking-tight text-brand-primary drop-shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:text-brand-secondary">{{ product.name }}</h1>

				<div class="mt-6 flex justify-center">
					<div class="w-full max-w-sm bg-transparent p-0 text-center">
						<p class="m-0 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ formatPrice(product.price) }}</p>
						<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">
							{{ installments }}x sem juros de {{ formatPrice(installmentValue) }}
						</p>
						<p class="m-0 mt-2 text-sm font-semibold text-brand-primary">
							No pix: {{ formatPrice(pixPrice) }}
						</p>
					</div>
				</div>

				<p v-if="cartMessage" class="m-0 mt-3 text-center text-sm font-medium text-brand-primary">{{ cartMessage }}</p>
				<p v-if="favoriteMessage" class="m-0 mt-2 text-center text-sm font-medium text-brand-primary">{{ favoriteMessage }}</p>

				<div class="mt-4 flex flex-wrap justify-center gap-2">
					<button
						type="button"
						:disabled="isAddingToCart"
						class="inline-flex h-11 w-fit items-center rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-70"
						@click="$emit('add-cart')"
					>
						{{ isAddingToCart ? 'Adicionando...' : 'Adicionar ao carrinho' }}
					</button>
					<button
						type="button"
						:disabled="isAddingToFavorites"
						class="inline-flex h-11 w-fit items-center rounded-lg border border-brand-primary bg-white px-6 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-900"
						@click="$emit('add-favorite')"
					>
						{{ isAddingToFavorites ? 'Salvando...' : 'Adicionar aos favoritos' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type ProductDetailData = {
	product_id: number
	name: string
	price: number
	stock: number
	category?: {
		name: string
	}
}

export default defineComponent({
	name: 'ProductDetailHero',
	emits: ['add-cart', 'add-favorite'],
	props: {
		product: {
			type: Object as PropType<ProductDetailData>,
			required: true
		},
		productImage: {
			type: String,
			required: true
		},
		installments: {
			type: Number,
			required: true
		},
		installmentValue: {
			type: Number,
			required: true
		},
		pixPrice: {
			type: Number,
			required: true
		},
		isAddingToCart: {
			type: Boolean,
			required: true
		},
		cartMessage: {
			type: String,
			required: true
		},
		isAddingToFavorites: {
			type: Boolean,
			required: true
		},
		favoriteMessage: {
			type: String,
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
