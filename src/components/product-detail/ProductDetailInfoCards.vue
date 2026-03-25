<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">{{ title }}</h2>
		<div class="mt-4 space-y-3">
			<div v-for="entry in entries" :key="entry.key" class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
				<p class="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ entry.key }}</p>
				<p class="m-0 mt-1 text-sm text-slate-600 dark:text-slate-300">{{ entry.value }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type StringEntry = {
	key: string
	value: string
}

export default defineComponent({
	name: 'ProductDetailInfoCards',
	props: {
		title: {
			type: String,
			required: true
		},
		entries: {
			type: Array as PropType<StringEntry[]>,
			required: true
		}
	}
})
</script>
