import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import CartView from '../pages/CartView.vue'
import CheckOut from '../pages/CheckOut.vue'
import PerfilView from '../pages/PerfilView.vue'
import ProductDetail from '../pages/ProductDetail.vue'
import SignInView from '../pages/SignInView.vue'
import SignUpView from '../pages/SignUpView.vue'
import { isAuthenticated } from '../lib/auth'

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
			component: CartView
		},
		{
			path: '/checkout',
			name: 'checkout',
			component: CheckOut
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
			path: '/produto/:id',
			name: 'product-detail',
			component: ProductDetail,
			props: true
		}
	]
})

router.beforeEach((to) => {
	const loggedIn = isAuthenticated()

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

	return true
})

export default router
