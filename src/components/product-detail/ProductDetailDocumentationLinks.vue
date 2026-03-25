<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Documentacao</h2>
		<div class="mt-4 space-y-2">
			<a
				v-for="entry in entries"
				:key="entry.key"
				:href="entry.value"
				target="_blank"
				rel="noreferrer noopener"
				class="block rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-brand-primary no-underline transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
			>
				{{ entry.key }}
			</a>
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
	name: 'ProductDetailDocumentationLinks',
	props: {
		entries: {
			type: Array as PropType<StringEntry[]>,
			required: true
		}
	}
})
</script>
