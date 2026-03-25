<template>
	<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Pagamento</h2>
		<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
			<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethodModel === 'pix' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
				<input v-model="paymentMethodModel" type="radio" value="pix" />
				PIX
			</label>
			<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethodModel === 'card' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
				<input v-model="paymentMethodModel" type="radio" value="card" />
				Cartao
			</label>
			<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm" :class="paymentMethodModel === 'boleto' ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'">
				<input v-model="paymentMethodModel" type="radio" value="boleto" />
				Boleto
			</label>
		</div>

		<div v-if="paymentMethodModel === 'card'" class="mt-4 space-y-3">
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<input
					:value="cardForm.holderName"
					type="text"
					placeholder="Nome impresso no cartao"
					class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
					@input="updateCardField('holderName', $event)"
				/>
				<input
					:value="cardForm.number"
					type="text"
					placeholder="Numero do cartao"
					class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
					@input="updateCardField('number', $event)"
				/>
				<input
					:value="cardForm.expiration"
					type="text"
					placeholder="Validade (MM/AA)"
					class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
					@input="updateCardField('expiration', $event)"
				/>
				<input
					:value="cardForm.cvv"
					type="text"
					placeholder="CVV"
					class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
					@input="updateCardField('cvv', $event)"
				/>
			</div>

			<div>
				<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Parcelamento</label>
				<select
					v-model.number="selectedInstallmentsModel"
					class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
				>
					<option v-for="installment in installmentOptions" :key="installment" :value="installment">
						{{ installment }}x de {{ formatPrice(cardInstallmentValue) }} sem juros
					</option>
				</select>
			</div>
		</div>

		<p v-if="paymentMethodModel === 'pix'" class="m-0 mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
			Desconto PIX aplicado: {{ formatPrice(pixDiscountAmount) }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type PaymentMethod = 'pix' | 'card' | 'boleto'

type CardForm = {
	holderName: string
	number: string
	expiration: string
	cvv: string
}

export default defineComponent({
	name: 'CheckoutPaymentMethod',
	emits: ['update:paymentMethod', 'update:selectedInstallments', 'update:cardForm'],
	props: {
		paymentMethod: {
			type: String as PropType<PaymentMethod>,
			required: true
		},
		selectedInstallments: {
			type: Number,
			required: true
		},
		installmentOptions: {
			type: Array as PropType<number[]>,
			required: true
		},
		cardForm: {
			type: Object as PropType<CardForm>,
			required: true
		},
		cardInstallmentValue: {
			type: Number,
			required: true
		},
		pixDiscountAmount: {
			type: Number,
			required: true
		}
	},
	computed: {
		paymentMethodModel: {
			get(): PaymentMethod {
				return this.paymentMethod
			},
			set(value: PaymentMethod) {
				this.$emit('update:paymentMethod', value)
			}
		},
		selectedInstallmentsModel: {
			get(): number {
				return this.selectedInstallments
			},
			set(value: number) {
				this.$emit('update:selectedInstallments', value)
			}
		}
	},
	methods: {
		updateCardField(field: keyof CardForm, event: Event): void {
			const target = event.target as HTMLInputElement
			this.$emit('update:cardForm', {
				...this.cardForm,
				[field]: target.value
			})
		},
		formatPrice(price: number): string {
			return new Intl.NumberFormat('pt-BR', {
				style: 'currency',
				currency: 'BRL'
			}).format(price)
		}
	}
})
</script>
