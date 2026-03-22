import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import CartView from '../pages/CartView.vue'
import CheckOut from '../pages/CheckOut.vue'
import PerfilView from '../pages/PerfilView.vue'
import ProductDetail from '../pages/ProductDetail.vue'

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
			path: '/perfil',
			name: 'perfil',
			component: PerfilView
		},
		{
			path: '/produto/:id',
			name: 'product-detail',
			component: ProductDetail,
			props: true
		}
	]
})

export default router
