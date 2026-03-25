import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../pages/HomeView.vue')
		},
		{
			path: '/cart',
			name: 'cart',
			component: () => import('../pages/CartView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/checkout',
			name: 'checkout',
			component: () => import('../pages/CheckOut.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/sign-in',
			name: 'sign-in',
			component: () => import('../pages/SignInView.vue'),
			meta: { requiresGuest: true }
		},
		{
			path: '/sign-up',
			name: 'sign-up',
			component: () => import('../pages/SignUpView.vue'),
			meta: { requiresGuest: true }
		},
		{
			path: '/perfil',
			name: 'perfil',
			component: () => import('../pages/PerfilView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/meus-pedidos',
			name: 'my-orders',
			component: () => import('../pages/MyOrdersView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/favoritos',
			name: 'favorites',
			component: () => import('../pages/FavoriteView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/busca',
			name: 'search',
			component: () => import('../pages/SearchView.vue')
		},
		{
			path: '/admin',
			name: 'admin',
			component: () => import('../pages/AdminView.vue'),
			meta: { requiresAuth: true, requiresAdmin: true }
		},
		{
			path: '/produto/:id',
			name: 'product-detail',
			component: () => import('../pages/ProductDetail.vue'),
			props: true
		}
	]
})

async function isCurrentUserAdmin(): Promise<boolean> {
	const authUser = await getCurrentAuthUser()
	if (!authUser) {
		return false
	}

	const byAuthUid = await supabase
		.from('users')
		.select('role:role_id(name)')
		.eq('auth_uid', authUser.id)
		.maybeSingle()

	let roleData = byAuthUid.data?.role as any

	if (!roleData && authUser.email) {
		const byEmail = await supabase
			.from('users')
			.select('role:role_id(name)')
			.eq('email', authUser.email)
			.maybeSingle()

		roleData = byEmail.data?.role as any
	}

	const role = Array.isArray(roleData) ? roleData[0] : roleData
	return String(role?.name || '').toUpperCase() === 'ADMIN'
}

router.beforeEach(async (to) => {
	const session = await getCurrentSession()
	const loggedIn = Boolean(session)

	if (to.meta.requiresAuth && !loggedIn) {
		return {
			name: 'sign-in',
			query: {
				redirect: to.fullPath
			}
		}
	}

	if (to.meta.requiresGuest && loggedIn) {
		return { name: 'perfil' }
	}

	if (to.meta.requiresAdmin) {
		if (!loggedIn) {
			return {
				name: 'sign-in',
				query: {
					redirect: to.fullPath
				}
			}
		}

		const admin = await isCurrentUserAdmin()
		if (!admin) {
			return { name: 'home' }
		}
	}

	return true
})

export default router
