<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
		<h2 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Video</h2>
		<p v-if="videoIntroduction" class="m-0 mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{{ videoIntroduction }}</p>
		<div v-if="videoEmbedLink" class="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
			<div class="aspect-video">
				<iframe
					class="h-full w-full"
					:src="videoEmbedLink"
					title="Video do produto"
					loading="lazy"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		</div>
		<p v-else-if="videoLink" class="m-0 mt-3 text-sm text-slate-600 dark:text-slate-300">
			Preview nao disponivel para este link. Abra em nova aba:
			<a :href="videoLink" target="_blank" rel="noreferrer noopener" class="font-semibold text-brand-primary">{{ videoLink }}</a>
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProductDetailVideoBlock',
	props: {
		videoIntroduction: {
			type: String,
			required: true
		},
		videoLink: {
			type: String,
			required: true
		},
		videoEmbedLink: {
			type: String,
			required: true
		}
	}
})
</script>
