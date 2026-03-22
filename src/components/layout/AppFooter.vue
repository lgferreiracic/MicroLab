<template>
	<footer class="mt-10 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
		<div class="mx-auto w-full max-w-440 px-4 py-10 sm:px-6 lg:px-12">
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
				<div>
					<h3 class="m-0 text-2xl font-semibold text-brand-primary">MicroLab</h3>
					<p class="m-0 mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
						Placas, sensores e kits para transformar ideias em projetos reais. Qualidade tecnica, envio rapido e suporte especializado.
					</p>
					<div class="mt-4 flex items-center gap-3 text-slate-500 dark:text-slate-400">
						<a href="#" aria-label="Instagram" class="transition-colors hover:text-brand-primary">
							<i class="pi pi-instagram text-lg" />
						</a>
						<a href="#" aria-label="YouTube" class="transition-colors hover:text-brand-primary">
							<i class="pi pi-youtube text-lg" />
						</a>
						<a href="#" aria-label="LinkedIn" class="transition-colors hover:text-brand-primary">
							<i class="pi pi-linkedin text-lg" />
						</a>
					</div>
				</div>

				<div>
					<h4 class="m-0 text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">Institucional</h4>
					<ul class="m-0 mt-3 list-none space-y-2 p-0 text-sm text-slate-600 dark:text-slate-300">
						<li><a href="#" class="transition-colors hover:text-brand-primary">Quem somos</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Politica de privacidade</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Termos de uso</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Trabalhe conosco</a></li>
					</ul>
				</div>

				<div>
					<h4 class="m-0 text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">Ajuda</h4>
					<ul class="m-0 mt-3 list-none space-y-2 p-0 text-sm text-slate-600 dark:text-slate-300">
						<li><a href="#" class="transition-colors hover:text-brand-primary">Central de suporte</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Frete e entrega</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Trocas e devolucoes</a></li>
						<li><a href="#" class="transition-colors hover:text-brand-primary">Formas de pagamento</a></li>
					</ul>
				</div>

				<div>
					<h4 class="m-0 text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-100">Receba novidades</h4>
					<p class="m-0 mt-3 text-sm text-slate-600 dark:text-slate-300">
						Promocoes e lancamentos direto no seu e-mail.
					</p>
					<form class="mt-4 flex flex-col gap-2 sm:flex-row" @submit.prevent>
						<input
							type="email"
							placeholder="Seu melhor e-mail"
							class="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-brand-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
						/>
						<button
							type="submit"
							class="h-11 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary"
						>
							Inscrever
						</button>
					</form>
				</div>
			</div>

			<div class="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
				<p class="m-0">© {{ currentYear }} MicroLab. Todos os direitos reservados.</p>
				<p class="m-0">CNPJ 00.000.000/0001-00 | Sao Paulo - SP</p>
			</div>
		</div>
	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AppFooter',
	computed: {
		currentYear(): number {
			return new Date().getFullYear()
		}
	}
})
</script>
