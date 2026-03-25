<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Cadastrar categoria</h2>
		<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Crie novas categorias para organizar os produtos.</p>

		<div class="mt-4 space-y-3">
			<input
				v-model="categoryFormName"
				type="text"
				placeholder="Nome da categoria"
				class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
			/>
			<p v-if="categoryMessage" class="m-0 text-sm text-brand-primary">{{ categoryMessage }}</p>
			<button
				type="button"
				:disabled="isSavingCategory"
				class="h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
				@click="createCategory"
			>
				{{ isSavingCategory ? 'Salvando...' : 'Salvar categoria' }}
			</button>
		</div>

		<div class="mt-5 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
			<p class="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Categorias existentes</p>
			<div class="mt-2 flex flex-wrap gap-2">
				<span
					v-for="category in categories"
					:key="category.category_id"
					class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary"
				>
					{{ category.name }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Category } from '../../model/category.model'
import { supabase } from '../../lib/supabase'

export default defineComponent({
	name: 'AdminCategoryManager',
	emits: ['category-created'],
	props: {
		categories: {
			type: Array as PropType<Category[]>,
			required: true
		}
	},
	data() {
		return {
			categoryFormName: '',
			isSavingCategory: false,
			categoryMessage: ''
		}
	},
	methods: {
		async createCategory(): Promise<void> {
			const name = this.categoryFormName.trim()
			if (!name) {
				this.categoryMessage = 'Informe o nome da categoria.'
				return
			}

			this.isSavingCategory = true
			this.categoryMessage = ''

			try {
				const { error } = await supabase
					.from('category')
					.insert({ name })

				if (error) {
					throw new Error(error.message)
				}

				this.categoryMessage = 'Categoria cadastrada com sucesso.'
				this.categoryFormName = ''
				this.$emit('category-created')
			} catch (error) {
				this.categoryMessage = error instanceof Error ? error.message : 'Nao foi possivel cadastrar a categoria.'
			} finally {
				this.isSavingCategory = false
			}
		}
	}
})
</script>
