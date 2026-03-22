<template>
  <section class="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6 lg:px-12">
    <div class="mt-5 space-y-8">
      <div
        v-for="section in sections"
        :key="section.id"
        class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-700 dark:bg-slate-900"
      >
        <h3 class="m-0 mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{{ section.title }}</h3>

        <div class="lg:hidden">
          <Carousel
            :value="section.products"
            :numVisible="1"
            :numScroll="1"
            :showNavigators="false"
            :showIndicators="true"
            :circular="true"
          >
            <template #item="slotProps">
              <RouterLink
                :to="{ name: 'product-detail', params: { id: slotProps.data.id } }"
                class="mx-auto flex h-full w-full max-w-sm rounded-xl bg-white p-3 no-underline transition hover:opacity-95 dark:bg-slate-900"
              >
                <ProductCard class="w-full" :product="slotProps.data" />
              </RouterLink>
            </template>
          </Carousel>
        </div>

        <div class="hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-[220px_1fr]">
          <img
            :src="section.image"
            :alt="`Categoria ${section.title}`"
            class="h-96 w-full rounded-lg object-contain"
          />

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <RouterLink
              v-for="product in section.products"
              :key="product.id"
              :to="{ name: 'product-detail', params: { id: product.id } }"
              class="flex h-full rounded-xl bg-white p-3 no-underline transition hover:opacity-95 dark:bg-slate-900"
            >
              <ProductCard class="w-full" :product="product" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Carousel from 'primevue/carousel'
import ProductCard from './ProductCard.vue'
import arduinoProduct from '../../assets/products/arduino.png'
import iotProduct from '../../assets/products/iot.png'
import raspberryProduct from '../../assets/products/raspberry.png'
import sensorsProduct from '../../assets/products/sensors.png'

export default defineComponent({
  name: 'ProductSection',
  components: {
    Carousel,
    ProductCard
  },
  data() {
    return {
      sections: [
        {
          id: 'arduino',
          title: 'Arduino',
          image: arduinoProduct,
          products: [
            { id: 101, name: 'Arduino Uno R3', image: arduinoProduct, price: 189.9, installments: 10 },
            { id: 102, name: 'Arduino Nano', image: arduinoProduct, price: 149.9, installments: 8 },
            { id: 103, name: 'Arduino Mega', image: arduinoProduct, price: 229.9, installments: 10 },
            { id: 104, name: 'Arduino Starter Kit', image: arduinoProduct, price: 299.9, installments: 12 }
          ]
        },
        {
          id: 'raspberry',
          title: 'Raspberry',
          image: raspberryProduct,
          products: [
            { id: 201, name: 'Raspberry Pi 4 4GB', image: raspberryProduct, price: 699.9, installments: 12 },
            { id: 202, name: 'Raspberry Pi 4 8GB', image: raspberryProduct, price: 899.9, installments: 12 },
            { id: 203, name: 'Raspberry Pi Zero 2 W', image: raspberryProduct, price: 289.9, installments: 10 },
            { id: 204, name: 'Raspberry Pi Pico W', image: raspberryProduct, price: 89.9, installments: 6 }
          ]
        },
        {
          id: 'iot',
          title: 'IoT',
          image: iotProduct,
          products: [
            { id: 301, name: 'Kit IoT ESP32', image: iotProduct, price: 359.9, installments: 12 },
            { id: 302, name: 'Kit Wi-Fi ESP8266', image: iotProduct, price: 249.9, installments: 10 },
            { id: 303, name: 'Gateway LoRa', image: iotProduct, price: 489.9, installments: 12 },
            { id: 304, name: 'Modulo NB-IoT', image: iotProduct, price: 319.9, installments: 10 }
          ]
        },
        {
          id: 'sensors',
          title: 'Sensores',
          image: sensorsProduct,
          products: [
            { id: 401, name: 'Sensor DHT22', image: sensorsProduct, price: 49.9, installments: 4 },
            { id: 402, name: 'Sensor PIR', image: sensorsProduct, price: 39.9, installments: 4 },
            { id: 403, name: 'Sensor Ultrassonico HC-SR04', image: sensorsProduct, price: 34.9, installments: 4 },
            { id: 404, name: 'Sensor de Gas MQ-2', image: sensorsProduct, price: 44.9, installments: 4 }
          ]
        }
      ]
    }
  }
})
</script>
