<template>
	<div class="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Resumo</h2>

		<div class="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm dark:border-slate-700">
			<div class="flex justify-between">
				<span class="text-slate-600 dark:text-slate-300">Subtotal</span>
				<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(subtotal) }}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-slate-600 dark:text-slate-300">Frete</span>
				<span class="font-medium text-slate-800 dark:text-slate-100">{{ formatPrice(shippingCost) }}</span>
			</div>
			<div v-if="paymentMethod === 'pix'" class="flex justify-between">
				<span class="text-emerald-700 dark:text-emerald-300">Desconto PIX (10%)</span>
				<span class="font-medium text-emerald-700 dark:text-emerald-300">- {{ formatPrice(pixDiscountAmount) }}</span>
			</div>
		</div>

		<div class="mt-4 flex justify-between">
			<span class="text-lg font-semibold text-slate-800 dark:text-slate-100">Total</span>
			<span class="text-lg font-bold text-brand-primary">{{ formatPrice(payableTotal) }}</span>
		</div>

		<p v-if="paymentMethod === 'card'" class="m-0 mt-2 text-xs text-slate-600 dark:text-slate-300">
			Pagamento em {{ selectedInstallments }}x de {{ formatPrice(cardInstallmentValue) }} sem juros.
		</p>

		<p v-if="checkoutMessage" class="m-0 mt-4 text-sm text-brand-primary">{{ checkoutMessage }}</p>

		<button
			type="button"
			:disabled="isPlacingOrder || !hasAddresses || !selectedAddressId"
			class="mt-6 w-full rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
			@click="$emit('place-order')"
		>
			{{ isPlacingOrder ? 'Finalizando...' : 'Finalizar compra' }}
		</button>
		<button
			type="button"
			class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
			@click="$emit('back-to-cart')"
		>
			Voltar ao carrinho
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type PaymentMethod = 'pix' | 'card' | 'boleto'

export default defineComponent({
	name: 'CheckoutOrderSummary',
	emits: ['place-order', 'back-to-cart'],
	props: {
		subtotal: {
			type: Number,
			required: true
		},
		shippingCost: {
			type: Number,
			required: true
		},
		pixDiscountAmount: {
			type: Number,
			required: true
		},
		payableTotal: {
			type: Number,
			required: true
		},
		paymentMethod: {
			type: String as PropType<PaymentMethod>,
			required: true
		},
		selectedInstallments: {
			type: Number,
			required: true
		},
		cardInstallmentValue: {
			type: Number,
			required: true
		},
		checkoutMessage: {
			type: String,
			required: true
		},
		isPlacingOrder: {
			type: Boolean,
			required: true
		},
		hasAddresses: {
			type: Boolean,
			required: true
		},
		selectedAddressId: {
			type: Number as PropType<number | null>,
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
