<template>
	<section class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-12 dark:bg-slate-950">
		<div class="mx-auto w-full max-w-7xl">
			<h1 class="m-0 text-2xl font-semibold text-slate-800 dark:text-slate-100">Detalhe do produto</h1>
			<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Informacoes tecnicas, preco e disponibilidade.</p>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProductDetail'
})
</script>
