<template>
	<div class="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Endereco de entrega</h2>
		<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Selecione o endereco cadastrado para este pedido.</p>

		<div v-if="addresses.length" class="mt-4 space-y-3">
			<label
				v-for="address in addresses"
				:key="address.address_id"
				class="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition"
				:class="modelValue === address.address_id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 dark:border-slate-700'"
			>
				<input :checked="modelValue === address.address_id" :value="address.address_id" type="radio" class="mt-1" @change="$emit('update:modelValue', address.address_id)" />
				<div class="text-sm text-slate-700 dark:text-slate-200">
					<p class="m-0 font-semibold">{{ address.street }}, {{ address.number }}</p>
					<p class="m-0 mt-1">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
					<p class="m-0 mt-1">CEP {{ address.zip_code }}</p>
					<p v-if="address.complement" class="m-0 mt-1 text-slate-500 dark:text-slate-400">Comp.: {{ address.complement }}</p>
				</div>
			</label>
		</div>
		<p v-else class="m-0 mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
			Voce nao possui endereco cadastrado. Adicione em Minha conta para continuar.
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type CheckoutAddress = {
	address_id: number
	street: string
	number: string
	complement: string | null
	neighborhood: string
	city: string
	state: string
	zip_code: string
}

export default defineComponent({
	name: 'CheckoutAddressSelector',
	emits: ['update:modelValue'],
	props: {
		modelValue: {
			type: Number as PropType<number | null>,
			required: true
		},
		addresses: {
			type: Array as PropType<CheckoutAddress[]>,
			required: true
		}
	}
})
</script>
