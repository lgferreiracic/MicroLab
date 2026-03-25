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
					<AdminPanelSidebar v-model="activePanel" />
					<AdminCategoryManager
						v-if="activePanel === 'categories'"
						:categories="categories"
						@category-created="loadCategories"
					/>
					<AdminProductForm
						v-else
						:categories="categories"
						@product-created="onProductCreated"
					/>
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
import AdminPanelSidebar from '../components/admin/AdminPanelSidebar.vue'
import AdminCategoryManager from '../components/admin/AdminCategoryManager.vue'
import AdminProductForm from '../components/admin/AdminProductForm.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'
import type { Category } from '../model/category.model'

export default defineComponent({
	name: 'AdminView',
	components: {
		AppHeader,
		AppNavbar,
		AppFooter,
		AdminPanelSidebar,
		AdminCategoryManager,
		AdminProductForm
	},
	data() {
		return {
			isLoading: true,
			isAdmin: false,
			activePanel: 'categories' as 'categories' | 'products',
			accessMessage: '',
			categories: [] as Category[]
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

			this.categories = (data || []) as Category[]
		},
		onProductCreated(): void {
			if (!this.categories.length) {
				void this.loadCategories()
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
