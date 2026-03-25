<template>
	<div class="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
		<img :src="descriptionBanner" :alt="`${productName} banner`" class="w-full object-cover" />
		<div v-if="textPhrase || textIntroduction" class="border-t border-slate-200 px-5 py-4 dark:border-slate-700">
			<p v-if="textPhrase" class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">{{ textPhrase }}</p>
			<p v-if="textIntroduction" class="m-0 mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ textIntroduction }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProductDetailBannerIntro',
	props: {
		productName: {
			type: String,
			required: true
		},
		descriptionBanner: {
			type: String,
			required: true
		},
		textPhrase: {
			type: String,
			required: true
		},
		textIntroduction: {
			type: String,
			required: true
		}
	}
})
</script>
