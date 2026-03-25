<template>
	<aside class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
		<p class="m-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Painel</p>
		<div class="space-y-2">
			<button
				type="button"
				class="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
				:class="modelValue === 'categories' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'"
				@click="$emit('update:modelValue', 'categories')"
			>
				Gerenciar Categorias
			</button>
			<button
				type="button"
				class="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
				:class="modelValue === 'products' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'"
				@click="$emit('update:modelValue', 'products')"
			>
				Gerenciar Produtos
			</button>
		</div>
	</aside>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type AdminPanel = 'categories' | 'products'

export default defineComponent({
	name: 'AdminPanelSidebar',
	emits: ['update:modelValue'],
	props: {
		modelValue: {
			type: String as PropType<AdminPanel>,
			required: true
		}
	}
})
</script>
