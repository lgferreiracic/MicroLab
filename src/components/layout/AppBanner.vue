<template>
	<section class="w-full">
		<Carousel
			:value="banners"
			:num-visible="1"
			:num-scroll="1"
			:circular="true"
			:autoplay-interval="4500"
			:show-navigators="false"
			class="app-banner-carousel w-full"
		>
			<template #item="slotProps">
				<button
					type="button"
					class="h-56 w-full cursor-pointer sm:h-80 lg:h-135"
					@click="handleBannerClick(slotProps.data.category)"
				>
					<img
						:src="slotProps.data.image"
						:alt="slotProps.data.alt"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</button>
			</template>
		</Carousel>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Carousel from 'primevue/carousel'
import arduinoBanner from '../../assets/banners/arduino.png'
import crealityBanner from '../../assets/banners/creality.png'
import raspberryBanner from '../../assets/banners/raspberry.jpg'

export default defineComponent({
	name: 'AppBanner',
	components: {
		Carousel
	},
	data() {
		return {
			banners: [
				{ id: 1, image: arduinoBanner, alt: 'Banner Arduino', category: 'Arduino' },
				{ id: 2, image: crealityBanner, alt: 'Banner Creality', category: 'Impressoras 3D' },
				{ id: 3, image: raspberryBanner, alt: 'Banner Raspberry', category: 'Raspberry' }
			]
		}
	},
	methods: {
		handleBannerClick(category: string): void {
			void this.$router.push({
				name: 'search',
				query: { category }
			})
		}
	}
})
</script>

<style scoped>
.app-banner-carousel {
	position: relative;
}

.app-banner-carousel :deep(.p-carousel-indicator-list) {
	position: absolute;
	left: 50%;
	bottom: 0.5rem;
	transform: translateX(-50%);
	z-index: 10;
	margin: 0;
}

.app-banner-carousel :deep(.p-carousel-indicator-button) {
	background-color: var(--color-brand-primary);
	opacity: 0.6;
	width: 0.625rem;
	height: 0.625rem;
}

.app-banner-carousel :deep(.p-carousel-indicator-active .p-carousel-indicator-button) {
	opacity: 1;
}

@media (min-width: 640px) {
	.app-banner-carousel :deep(.p-carousel-indicator-list) {
		bottom: 0.75rem;
	}

	.app-banner-carousel :deep(.p-carousel-indicator-button) {
		width: 0.75rem;
		height: 0.75rem;
	}
}
</style>
