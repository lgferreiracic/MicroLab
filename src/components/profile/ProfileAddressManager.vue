<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<div class="flex items-center justify-between gap-3">
			<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Meus enderecos</h2>
			<button
				type="button"
				class="h-9 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-secondary"
				@click="$emit('create-address')"
			>
				Adicionar endereco
			</button>
		</div>

		<p v-if="addressMessage" class="m-0 mt-3 text-sm text-brand-primary">{{ addressMessage }}</p>

		<div class="mt-4 space-y-3">
			<div
				v-for="address in addresses"
				:key="address.address_id"
				class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="text-sm text-slate-700 dark:text-slate-200">
						<p class="m-0 font-semibold">{{ address.street }}, {{ address.number }}</p>
						<p class="m-0 mt-1">{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
						<p class="m-0 mt-1">CEP {{ address.zip_code }} - {{ address.country }}</p>
						<p v-if="address.complement" class="m-0 mt-1 text-slate-500 dark:text-slate-400">Comp.: {{ address.complement }}</p>
					</div>
					<button
						type="button"
						class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
						@click="$emit('edit-address', address)"
					>
						Editar
					</button>
				</div>
			</div>

			<p v-if="!addresses.length" class="m-0 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
				Voce ainda nao cadastrou enderecos.
			</p>
		</div>

		<div v-if="isAddressFormOpen" class="mt-4 rounded-lg border border-brand-tertiary/40 bg-slate-50 p-4 dark:border-brand-tertiary/30 dark:bg-slate-800/60">
			<h3 class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
				{{ editingAddressId ? 'Editar endereco' : 'Novo endereco' }}
			</h3>

			<div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
				<input
					:value="addressForm.zip_code"
					type="text"
					placeholder="CEP"
					class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
					@input="$emit('update:address-form', { ...addressForm, zip_code: ($event.target as HTMLInputElement).value }); $emit('zip-input')"
					@blur="$emit('lookup-zip', true)"
					@keyup.enter="$emit('lookup-zip', true)"
				/>
				<input :value="addressForm.street" type="text" placeholder="Rua" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, street: ($event.target as HTMLInputElement).value })" />
				<input :value="addressForm.number" type="text" placeholder="Numero" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, number: ($event.target as HTMLInputElement).value })" />
				<input :value="addressForm.complement" type="text" placeholder="Complemento" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, complement: ($event.target as HTMLInputElement).value })" />
				<input :value="addressForm.neighborhood" type="text" placeholder="Bairro" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, neighborhood: ($event.target as HTMLInputElement).value })" />
				<input :value="addressForm.city" type="text" placeholder="Cidade" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, city: ($event.target as HTMLInputElement).value })" />
				<input :value="addressForm.state" type="text" placeholder="Estado" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" @input="$emit('update:address-form', { ...addressForm, state: ($event.target as HTMLInputElement).value })" />
			</div>

			<div class="mt-3 flex gap-2">
				<button type="button" :disabled="isSavingAddress" class="h-9 rounded-lg bg-brand-primary px-3 text-sm font-semibold text-white transition hover:bg-brand-secondary" @click="$emit('save-address')">
					{{ isSavingAddress ? 'Salvando...' : 'Salvar endereco' }}
				</button>
				<button type="button" class="h-9 rounded-lg bg-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600" @click="$emit('cancel-address')">
					Cancelar
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type AddressRecord = {
	address_id: number
	user_id: number
	street: string
	number: string
	complement: string | null
	neighborhood: string
	city: string
	state: string
	zip_code: string
	country: string
}

type AddressForm = {
	street: string
	number: string
	complement: string
	neighborhood: string
	city: string
	state: string
	zip_code: string
	country: string
}

export default defineComponent({
	name: 'ProfileAddressManager',
	emits: [
		'create-address',
		'edit-address',
		'save-address',
		'cancel-address',
		'update:address-form',
		'zip-input',
		'lookup-zip'
	],
	props: {
		addresses: {
			type: Array as PropType<AddressRecord[]>,
			required: true
		},
		addressMessage: {
			type: String,
			required: true
		},
		isAddressFormOpen: {
			type: Boolean,
			required: true
		},
		isSavingAddress: {
			type: Boolean,
			required: true
		},
		editingAddressId: {
			type: Number as PropType<number | null>,
			required: true
		},
		addressForm: {
			type: Object as PropType<AddressForm>,
			required: true
		}
	}
})
</script>
