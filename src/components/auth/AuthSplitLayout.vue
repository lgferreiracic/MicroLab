<template>
	<section class="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
		<div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-tertiary/30 blur-3xl"></div>
		<div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-primary/25 blur-3xl"></div>

		<div class="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2 dark:bg-slate-900">
			<div class="hidden p-10 text-white lg:block" :class="leftGradientClass">
				<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">MicroLab</p>
				<h1 class="m-0 mt-3 text-3xl font-bold">{{ title }}</h1>
				<p class="m-0 mt-4 text-sm leading-6 text-white/90">{{ description }}</p>
			</div>

			<div class="p-6 sm:p-10">
				<slot></slot>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AuthSplitLayout',
	props: {
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		leftGradientClass: {
			type: String,
			required: true
		}
	}
})
</script>
