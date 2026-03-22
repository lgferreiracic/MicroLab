import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import router from './router'
import './style.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.dark'
		}
	}
})

app.use(ConfirmationService)
app.use(pinia)
app.use(router)

app.mount('#app')
