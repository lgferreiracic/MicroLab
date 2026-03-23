import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import CartView from '../pages/CartView.vue'
import CheckOut from '../pages/CheckOut.vue'
import PerfilView from '../pages/PerfilView.vue'
import MyOrdersView from '../pages/MyOrdersView.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import FavoriteView from '../pages/FavoriteView.vue'
import SearchView from '../pages/SearchView.vue'
import AdminView from '../pages/AdminView.vue'
import SignInView from '../pages/SignInView.vue'
import SignUpView from '../pages/SignUpView.vue'
import { supabase } from '../lib/supabase'
import { getCurrentAuthUser, getCurrentSession } from '../services/auth.service'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/cart',
			name: 'cart',
			component: CartView,
			meta: { requiresAuth: true }
		},
		{
			path: '/checkout',
			name: 'checkout',
			component: CheckOut,
			meta: { requiresAuth: true }
		},
		{
			path: '/sign-in',
			name: 'sign-in',
			component: SignInView,
			meta: { requiresGuest: true }
		},
		{
			path: '/sign-up',
			name: 'sign-up',
			component: SignUpView,
			meta: { requiresGuest: true }
		},
		{
			path: '/perfil',
			name: 'perfil',
			component: PerfilView,
			meta: { requiresAuth: true }
		},
		{
			path: '/meus-pedidos',
			name: 'my-orders',
			component: MyOrdersView,
			meta: { requiresAuth: true }
		},
		{
			path: '/favoritos',
			name: 'favorites',
			component: FavoriteView,
			meta: { requiresAuth: true }
		},
		{
			path: '/busca',
			name: 'search',
			component: SearchView
		},
		{
			path: '/admin',
			name: 'admin',
			component: AdminView,
			meta: { requiresAuth: true, requiresAdmin: true }
		},
		{
			path: '/produto/:id',
			name: 'product-detail',
			component: ProductDetail,
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
