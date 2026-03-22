import { defineStore } from 'pinia'

type DeliveryState = {
	deliveryZip: string
	deliveryCity: string
	editableZip: string
}

const STORAGE_KEY = 'microlab_delivery'

function loadInitialState(): DeliveryState {
	if (typeof window === 'undefined') {
		return {
			deliveryZip: '00000-000',
			deliveryCity: 'Carregando cidade...',
			editableZip: '00000-000'
		}
	}

	const raw = window.localStorage.getItem(STORAGE_KEY)
	if (!raw) {
		return {
			deliveryZip: '00000-000',
			deliveryCity: 'Carregando cidade...',
			editableZip: '00000-000'
		}
	}

	try {
		const parsed = JSON.parse(raw) as Partial<DeliveryState>
		return {
			deliveryZip: typeof parsed.deliveryZip === 'string' ? parsed.deliveryZip : '00000-000',
			deliveryCity: typeof parsed.deliveryCity === 'string' ? parsed.deliveryCity : 'Carregando cidade...',
			editableZip: typeof parsed.editableZip === 'string' ? parsed.editableZip : '00000-000'
		}
	} catch {
		return {
			deliveryZip: '00000-000',
			deliveryCity: 'Carregando cidade...',
			editableZip: '00000-000'
		}
	}
}

export const useDeliveryStore = defineStore('delivery', {
	state: (): DeliveryState => loadInitialState(),
	actions: {
		setEditableZip(value: string): void {
			this.editableZip = value
			this.persist()
		},
		setDelivery(zip: string, city: string): void {
			this.deliveryZip = zip
			this.deliveryCity = city
			this.editableZip = zip
			this.persist()
		},
		setCity(city: string): void {
			this.deliveryCity = city
			this.persist()
		},
		persist(): void {
			if (typeof window === 'undefined') {
				return
			}

			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					deliveryZip: this.deliveryZip,
					deliveryCity: this.deliveryCity,
					editableZip: this.editableZip
				})
			)
		}
	}
})
