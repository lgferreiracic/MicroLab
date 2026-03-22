<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
		<AppHeader class="hidden md:block" title="Painel Admin" subtitle="" />
		<AppNavbar
			logo-text="MicroLab"
			@search="onSearch"
			@favorites="onFavorites"
			@login="onLogin"
			@cart="onCart"
		/>

		<section class="px-4 py-8 sm:px-6 lg:px-12">
			<div class="mx-auto w-full max-w-7xl">
				<h1 class="m-0 inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1.5 text-2xl font-extrabold tracking-tight text-brand-primary dark:bg-brand-secondary/15 dark:text-brand-secondary">Administracao</h1>
				<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Cadastre categorias e produtos da loja.</p>

				<div v-if="isLoading" class="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
					Validando acesso de administrador...
				</div>

				<div v-else-if="!isAdmin" class="mt-6 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
					{{ accessMessage || 'Acesso restrito para administradores.' }}
				</div>

				<div v-else class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
					<aside class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
						<p class="m-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Painel</p>
						<div class="space-y-2">
							<button
								type="button"
								class="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
								:class="activePanel === 'categories' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'"
								@click="activePanel = 'categories'"
							>
								Gerenciar Categorias
							</button>
							<button
								type="button"
								class="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
								:class="activePanel === 'products' ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'"
								@click="activePanel = 'products'"
							>
								Gerenciar Produtos
							</button>
						</div>
					</aside>

					<div v-if="activePanel === 'categories'" class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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

					<div v-else class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
						<h2 class="m-0 text-lg font-semibold text-slate-800 dark:text-slate-100">Cadastrar produto</h2>
						<p class="m-0 mt-2 text-sm text-slate-600 dark:text-slate-300">Cadastre produtos com campos estruturados de descricao.</p>

						<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<input
								v-model="productForm.name"
								type="text"
								placeholder="Nome do produto"
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
							/>
							<input
								v-model="productForm.priceText"
								type="text"
								inputmode="decimal"
								placeholder="Valor em reais"
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
							/>
							<input
								v-model.number="productForm.stock"
								type="number"
								min="0"
								step="1"
								placeholder="Quantidade em estoque"
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
							/>

							<select
								v-model.number="productForm.categoryId"
								class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
							>
								<option :value="0">Selecione uma categoria</option>
								<option v-for="category in categories" :key="category.category_id" :value="category.category_id">
									{{ category.name }}
								</option>
							</select>
						</div>

						<div class="mt-4">
							<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Imagem principal</p>
							<input
								v-model="productForm.bannerImage"
								type="text"
								placeholder="Link da imagem"
								class="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
							/>
						</div>

						<div class="mt-4">
							<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Descricao</p>
							<div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
								<input
									v-model="productForm.textPhrase"
									type="text"
									placeholder="Frase"
									class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								/>
								<input
									v-model="productForm.descriptionBanner"
									type="text"
									placeholder="Banner da descricao (link)"
									class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								/>
								<textarea
									v-model="productForm.textIntroduction"
									rows="3"
									placeholder="Introducao"
									class="rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
								></textarea>
							</div>

							<div class="mt-4">
								<div class="flex items-center justify-between gap-3">
									<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Extras (chave/valor)</p>
									<button
										type="button"
										class="h-8 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
										@click="addExtraField"
									>
										Adicionar extra
									</button>
								</div>

								<div class="mt-3 space-y-2">
									<div
										v-for="(field, index) in productForm.extraFields"
										:key="`extra-${index}`"
										class="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]"
									>
										<input
											v-model="field.key"
											type="text"
											placeholder="Chave"
											class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
										/>
										<input
											v-model="field.value"
											type="text"
											placeholder="Valor"
											class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
										/>
										<button
											type="button"
											class="h-10 rounded-lg bg-red-100 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
											@click="removeExtraField(index)"
										>
											Remover
										</button>
									</div>
								</div>
							</div>

							<div class="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
								<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Video</p>
								<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
									<input
										v-model="productForm.videoIntroduction"
										type="text"
										placeholder="Introducao"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
									<input
										v-model="productForm.videoLink"
										type="text"
										placeholder="Link"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
								</div>
							</div>

							<div class="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
								<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Pinout</p>
								<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
									<input
										v-model="productForm.pinout.img"
										type="text"
										placeholder="Imagem do pinout (link)"
										class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
									<textarea
										v-model="productForm.pinout.introduction"
										rows="3"
										placeholder="Introducao do pinout"
										class="rounded-lg border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:col-span-2"
									></textarea>
								</div>
							</div>

							<div class="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
								<div class="flex items-center justify-between gap-3">
									<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Itens inclusos</p>
									<button
										type="button"
										class="h-8 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
										@click="addComesWithField"
									>
										Adicionar item
									</button>
								</div>
								<div class="mt-3 space-y-2">
									<div
										v-for="(field, index) in productForm.comesWithFields"
										:key="`comes-${index}`"
										class="grid grid-cols-1 gap-2 sm:grid-cols-[100px_1fr_auto]"
									>
										<input v-model="field.key" type="text" placeholder="01" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<input v-model="field.value" type="text" placeholder="Item incluso" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<button type="button" class="h-10 rounded-lg bg-red-100 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" @click="removeComesWithField(index)">
											Remover
										</button>
									</div>
								</div>
							</div>

							<div class="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
								<div class="flex items-center justify-between gap-3">
									<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Documentacao</p>
									<button
										type="button"
										class="h-8 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
										@click="addDocumentationField"
									>
										Adicionar item
									</button>
								</div>
								<div class="mt-3 space-y-2">
									<div
										v-for="(field, index) in productForm.documentationFields"
										:key="`doc-${index}`"
										class="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]"
									>
										<input v-model="field.key" type="text" placeholder="Titulo do documento" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<input v-model="field.value" type="text" placeholder="Link" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<button type="button" class="h-10 rounded-lg bg-red-100 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" @click="removeDocumentationField(index)">
											Remover
										</button>
									</div>
								</div>
							</div>

							<div class="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
								<div class="flex items-center justify-between gap-3">
									<p class="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Especificacoes</p>
									<button
										type="button"
										class="h-8 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
										@click="addSpecificationField"
									>
										Adicionar item
									</button>
								</div>
								<div class="mt-3 space-y-2">
									<div
										v-for="(field, index) in productForm.specificationsFields"
										:key="`spec-${index}`"
										class="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr_auto]"
									>
										<input v-model="field.key" type="text" placeholder="Especificacao" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<input v-model="field.value" type="text" placeholder="Valor" class="h-10 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
										<button type="button" class="h-10 rounded-lg bg-red-100 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" @click="removeSpecificationField(index)">
											Remover
										</button>
									</div>
								</div>
							</div>

						</div>

						<p v-if="productMessage" class="m-0 mt-3 text-sm text-brand-primary">{{ productMessage }}</p>

						<button
							type="button"
							:disabled="isSavingProduct"
							class="mt-4 h-10 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
							@click="createProduct"
						>
							{{ isSavingProduct ? 'Salvando...' : 'Salvar produto' }}
						</button>
					</div>
				</div>
			</div>
		</section>

		<AppFooter />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'

type CategoryItem = {
	category_id: number
	name: string
}

type KeyValueField = {
	key: string
	value: string
}

type PinoutField = {
	img: string
	introduction: string
}

export default defineComponent({
	name: 'AdminView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter
	},
	data() {
		return {
			isLoading: true,
			isAdmin: false,
			activePanel: 'categories' as 'categories' | 'products',
			accessMessage: '',
			appUserId: null as number | null,
			categories: [] as CategoryItem[],
			categoryFormName: '',
			isSavingCategory: false,
			categoryMessage: '',
			isSavingProduct: false,
			productMessage: '',
			productForm: {
				name: '',
				priceText: '',
				stock: 0,
				categoryId: 0,
				bannerImage: '',
				textPhrase: '',
				textIntroduction: '',
				descriptionBanner: '',
				extraFields: [{ key: '', value: '' }] as KeyValueField[],
				pinout: {
					img: '',
					introduction: ''
				} as PinoutField,
				comesWithFields: [{ key: '01', value: '' }] as KeyValueField[],
				documentationFields: [{ key: '', value: '' }] as KeyValueField[],
				specificationsFields: [{ key: '', value: '' }] as KeyValueField[],
				videoIntroduction: '',
				videoLink: ''
			}
		}
	},
	async created() {
		await this.loadAdminContext()
	},
	methods: {
		async loadAdminContext(): Promise<void> {
			this.isLoading = true
			this.isAdmin = false
			this.accessMessage = ''

			try {
				const authUser = await getCurrentAuthUser()
				if (!authUser?.email) {
					this.accessMessage = 'Usuario nao autenticado.'
					return
				}

				const byAuthUid = await supabase
					.from('users')
					.select('user_id, role:role_id(name)')
					.eq('auth_uid', authUser.id)
					.maybeSingle()

				let profile = byAuthUid.data
				if (!profile) {
					const byEmail = await supabase
						.from('users')
						.select('user_id, role:role_id(name)')
						.eq('email', authUser.email)
						.maybeSingle()

					profile = byEmail.data
				}

				const roleData = Array.isArray((profile as any)?.role)
					? (profile as any)?.role?.[0]
					: (profile as any)?.role

				const roleName = String(roleData?.name || '').toUpperCase()
				if (roleName !== 'ADMIN') {
					this.accessMessage = 'Apenas usuarios ADMIN podem acessar este painel.'
					return
				}

				this.appUserId = (profile as any)?.user_id || null
				this.isAdmin = true
				await this.loadCategories()
			} finally {
				this.isLoading = false
			}
		},
		async loadCategories(): Promise<void> {
			const { data, error } = await supabase
				.from('category')
				.select('category_id, name')
				.order('name', { ascending: true })

			if (error) {
				this.categories = []
				return
			}

			this.categories = (data || []) as CategoryItem[]
		},
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
				await this.loadCategories()
			} catch (error) {
				this.categoryMessage = error instanceof Error ? error.message : 'Nao foi possivel cadastrar a categoria.'
			} finally {
				this.isSavingCategory = false
			}
		},
		addExtraField(): void {
			this.productForm.extraFields.push({ key: '', value: '' })
		},
		removeExtraField(index: number): void {
			if (this.productForm.extraFields.length === 1) {
				this.productForm.extraFields[0] = { key: '', value: '' }
				return
			}

			this.productForm.extraFields.splice(index, 1)
		},
		addComesWithField(): void {
			const next = String(this.productForm.comesWithFields.length + 1).padStart(2, '0')
			this.productForm.comesWithFields.push({ key: next, value: '' })
		},
		removeComesWithField(index: number): void {
			if (this.productForm.comesWithFields.length === 1) {
				this.productForm.comesWithFields[0] = { key: '01', value: '' }
				return
			}

			this.productForm.comesWithFields.splice(index, 1)
		},
		addDocumentationField(): void {
			this.productForm.documentationFields.push({ key: '', value: '' })
		},
		removeDocumentationField(index: number): void {
			if (this.productForm.documentationFields.length === 1) {
				this.productForm.documentationFields[0] = { key: '', value: '' }
				return
			}

			this.productForm.documentationFields.splice(index, 1)
		},
		addSpecificationField(): void {
			this.productForm.specificationsFields.push({ key: '', value: '' })
		},
		removeSpecificationField(index: number): void {
			if (this.productForm.specificationsFields.length === 1) {
				this.productForm.specificationsFields[0] = { key: '', value: '' }
				return
			}

			this.productForm.specificationsFields.splice(index, 1)
		},
		buildDescriptionObject(): Record<string, unknown> {
			const result: Record<string, unknown> = {}
			const text: Record<string, string | Record<string, string>> = {}
			const extras: Record<string, string> = {}
			const comesWith: Record<string, string> = {}
			const documentation: Record<string, string> = {}
			const specifications: Record<string, string> = {}

			if (this.productForm.textPhrase.trim()) {
				text.phrase = this.productForm.textPhrase.trim()
			}

			if (this.productForm.textIntroduction.trim()) {
				text.introduction = this.productForm.textIntroduction.trim()
			}

			this.productForm.extraFields.forEach((field) => {
				const key = field.key.trim()
				const value = field.value.trim()
				if (!key || !value) {
					return
				}
				extras[key] = value
			})

			if (Object.keys(extras).length) {
				text.extra = extras
			}

			if (Object.keys(text).length) {
				result.text = text
			}

			if (this.productForm.descriptionBanner.trim()) {
				result.banner = this.productForm.descriptionBanner.trim()
			}

			if (this.productForm.videoIntroduction.trim() || this.productForm.videoLink.trim()) {
				result.video = {
					introduction: this.productForm.videoIntroduction.trim(),
					link: this.productForm.videoLink.trim()
				}
			}

			if (this.productForm.pinout.img.trim() || this.productForm.pinout.introduction.trim()) {
				result.pinout = {
					img: this.productForm.pinout.img.trim(),
					introduction: this.productForm.pinout.introduction.trim()
				}
			}

			this.productForm.comesWithFields.forEach((field) => {
				const key = field.key.trim()
				const value = field.value.trim()
				if (!key || !value) {
					return
				}
				comesWith[key] = value
			})
			if (Object.keys(comesWith).length) {
				result['comes-with'] = comesWith
			}

			this.productForm.documentationFields.forEach((field) => {
				const key = field.key.trim()
				const value = field.value.trim()
				if (!key || !value) {
					return
				}
				documentation[key] = value
			})
			if (Object.keys(documentation).length) {
				result.documentation = documentation
			}

			this.productForm.specificationsFields.forEach((field) => {
				const key = field.key.trim()
				const value = field.value.trim()
				if (!key || !value) {
					return
				}
				specifications[key] = value
			})
			if (Object.keys(specifications).length) {
				result.specifications = specifications
			}

			return result
		},
		resetProductForm(): void {
			this.productForm = {
				name: '',
				priceText: '',
				stock: 0,
				categoryId: 0,
				bannerImage: '',
				textPhrase: '',
				textIntroduction: '',
				descriptionBanner: '',
				extraFields: [{ key: '', value: '' }],
				pinout: {
					img: '',
					introduction: ''
				},
				comesWithFields: [{ key: '01', value: '' }],
				documentationFields: [{ key: '', value: '' }],
				specificationsFields: [{ key: '', value: '' }],
				videoIntroduction: '',
				videoLink: ''
			}
		},
		async createProduct(): Promise<void> {
			if (!this.productForm.name.trim()) {
				this.productMessage = 'Informe o nome do produto.'
				return
			}

			if (!this.productForm.categoryId) {
				this.productMessage = 'Selecione uma categoria.'
				return
			}

			const parsedPrice = Number(String(this.productForm.priceText).replace(',', '.').trim())
			if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
				this.productMessage = 'Informe um valor valido para o produto.'
				return
			}

			if (this.productForm.stock < 0) {
				this.productMessage = 'Estoque deve ser maior ou igual a zero.'
				return
			}

			if (!this.productForm.bannerImage.trim()) {
				this.productMessage = 'Informe a imagem principal do produto.'
				return
			}

			const imgPayload = {
				banner: this.productForm.bannerImage.trim()
			}

			const descriptionPayload = this.buildDescriptionObject()
			if (!Object.keys(descriptionPayload).length) {
				this.productMessage = 'Preencha ao menos um campo de descricao.'
				return
			}

			this.isSavingProduct = true
			this.productMessage = ''

			try {
				const { error } = await supabase
					.from('product')
					.insert({
						name: this.productForm.name.trim(),
						price: parsedPrice,
						stock: this.productForm.stock,
						img: imgPayload,
						description: descriptionPayload,
						category_id: this.productForm.categoryId
					})

				if (error) {
					throw new Error(error.message)
				}

				this.productMessage = 'Produto cadastrado com sucesso.'
				this.resetProductForm()
			} catch (error) {
				this.productMessage = error instanceof Error ? error.message : 'Nao foi possivel cadastrar o produto.'
			} finally {
				this.isSavingProduct = false
			}
		},
		onSearch(searchTerm: string): void {
			console.log('search', searchTerm)
		},
		async onFavorites(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/favoritos' } })
				return
			}

			await this.$router.push({ name: 'favorites' })
		},
		async onLogin(): Promise<void> {
			const session = await getCurrentSession()
			if (session) {
				await this.$router.push({ name: 'perfil' })
				return
			}

			await this.$router.push({ name: 'sign-in' })
		},
		async onCart(): Promise<void> {
			const session = await getCurrentSession()
			if (!session) {
				await this.$router.push({ name: 'sign-in', query: { redirect: '/cart' } })
				return
			}

			await this.$router.push({ name: 'cart' })
		}
	}
})
</script>
