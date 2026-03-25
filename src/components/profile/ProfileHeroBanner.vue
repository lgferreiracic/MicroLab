<template>
	<div class="relative overflow-hidden rounded-2xl bg-linear-to-r from-brand-primary via-brand-secondary to-brand-tertiary p-6 text-white shadow-lg sm:p-8">
		<div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
		<div class="pointer-events-none absolute -bottom-16 right-12 h-32 w-32 rounded-full bg-white/10"></div>

		<p class="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">Area do cliente</p>
		<h1 class="m-0 mt-2 text-2xl font-semibold sm:text-3xl">{{ displayName }}</h1>
		<p class="m-0 mt-2 text-sm text-white/90">{{ displayEmail }}</p>

		<div class="mt-5 flex flex-wrap gap-2">
			<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Conta ativa</span>
			<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Membro desde {{ memberSince }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileHeroBanner',
	props: {
		displayName: {
			type: String,
			required: true
		},
		displayEmail: {
			type: String,
			required: true
		},
		memberSince: {
			type: String,
			required: true
		}
	}
})
</script>
