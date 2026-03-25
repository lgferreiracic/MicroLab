<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">{{ title }}</h2>
		<p v-if="introduction" class="m-0 mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{{ introduction }}</p>
		<img v-if="imageUrl" :src="imageUrl" :alt="imageAlt" :class="imageClass" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProductDetailImageBlock',
	props: {
		title: {
			type: String,
			required: true
		},
		introduction: {
			type: String,
			required: true
		},
		imageUrl: {
			type: String,
			required: true
		},
		imageAlt: {
			type: String,
			required: true
		},
		imageClass: {
			type: String,
			required: true
		}
	}
})
</script>
