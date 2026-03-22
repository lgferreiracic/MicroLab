<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <ConfirmDialog />

    <header class="bg-slate-900 text-white dark:bg-slate-900">
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <h1 class="m-0 text-2xl font-bold">E-commerce</h1>
        <div class="flex items-center gap-3">
          <span class="rounded-full bg-slate-700 px-3 py-1 text-sm font-medium">
            Carrinho ({{ totalItems }})
          </span>
          <Button
            :label="isDark ? 'Tema Claro' : 'Tema Escuro'"
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            size="small"
            outlined
            @click="toggleTheme"
          />
        </div>
      </div>
    </header>

    <main class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-4">
      <section class="lg:col-span-3">
        <h2 class="mb-4 text-xl font-semibold">Produtos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in products" 
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <aside class="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-1">
        <h2 class="mb-4 text-xl font-semibold">Seu Carrinho</h2>
        
        <div v-if="cartItems.length > 0">
          <DataView :value="cartItems" class="mb-4">
            <template #list="slotProps">
              <div class="space-y-3">
                <div
                  v-for="item in slotProps.items"
                  :key="item.product.id"
                  class="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div class="mb-3 flex items-center gap-3">
                    <img
                      v-if="getProductImage(item.product)"
                      :src="getProductImage(item.product)"
                      :alt="item.product.name"
                      class="h-12 w-12 rounded-md object-cover"
                    />
                    <div
                      v-else
                      class="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <i class="pi pi-image text-sm"></i>
                    </div>

                    <div class="min-w-0 flex-1">
                      <p class="m-0 truncate font-medium">{{ item.product.name }}</p>
                      <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Qtd: {{ item.quantity }}</p>
                    </div>

                    <span class="text-sm font-semibold text-emerald-600">
                      R$ {{ (item.product.price * item.quantity).toFixed(2) }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center justify-center gap-3">
                    <InputNumber
                      class="shrink-0"
                      :modelValue="item.quantity"
                      showButtons
                      buttonLayout="horizontal"
                      :step="1"
                      :min="1"
                      :max="99"
                      decrementButtonIcon="pi pi-minus"
                      incrementButtonIcon="pi pi-plus"
                      inputClass="w-14 text-center"
                      @update:modelValue="(value) => updateQuantity(item.product.id, value)"
                    />
                    <Button
                      label="Remover"
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      class="sm:min-w-30 justify-center"
                      @click="removeItem(item.product.id)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </DataView>

          <Button
            label="Remover todos"
            icon="pi pi-trash"
            severity="danger"
            outlined
            class="w-full"
            @click="confirmClearCart"
          />
        </div>

        <div class="space-y-1 border-t border-slate-200 pt-3 dark:border-slate-700">
          <p class="m-0 text-sm">Total de itens: {{ totalItems }}</p>
          <p class="m-0 text-base font-semibold">Preço final: R$ {{ finalPrice.toFixed(2) }}</p>
        </div>

        <Card
          v-if="cartItems.length === 0"
          class="border border-dashed border-slate-300 bg-slate-50 text-center shadow-none dark:border-slate-700 dark:bg-slate-800"
        >
          <template #content>
            <div class="space-y-2 py-1">
              <i class="pi pi-shopping-cart text-2xl text-slate-500 dark:text-slate-300"></i>
              <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Seu carrinho esta vazio.</p>
              <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Adicione produtos para ver o resumo aqui.</p>
            </div>
          </template>
        </Card>
      </aside>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import DataView from 'primevue/dataview'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import ProductCard from './components/ProductCard.vue'
import { Product } from './model/product.model'
import { Category } from './model/category.model'
import { CartItem } from './model/cart.model'
import arduinoUnoR3Img from './assets/Arduino Uno R3.png'
import raspberryPiPicoWImg from './assets/Raspberry Pi Pico W.png'
import esp32DevKitV1Img from './assets/ESP32 DevKit V1.png'
import stm32BluePillImg from './assets/STM32 Blue Pill.png'
import raspberryPi4ModelBImg from './assets/Raspberry Pi 4 Model B (4GB).png'
import jetsonNanoDeveloperKitImg from './assets/Jetson Nano Developer Kit.png'
import nodeMcuEsp8266Img from './assets/NodeMCU ESP8266.png'
import teensy41Img from './assets/Teensy 4.1.png'

export default defineComponent({
  components: {
    ProductCard,
    DataView,
    InputNumber,
    Button,
    Card,
    ConfirmDialog
  },
  setup() {
    const confirm = useConfirm()
    return {
      confirm
    }
  },
  data() {
    return {
      products: [] as Product[],
      cartItems: [] as CartItem[],
      isDark: false
    }
  },
  computed: {
    totalItems(): number {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    finalPrice(): number {
      return this.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
    }
  },
  methods: {
    handleAddToCart(product: Product): void {
      const existing = this.cartItems.find(item => item.product.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.cartItems.push({ product, quantity: 1 })
      }
    },
    updateQuantity(productId: number, value: number | null): void {
      const quantity = value ?? 1
      const item = this.cartItems.find(cartItem => cartItem.product.id === productId)
      if (!item) {
        return
      }

      if (quantity < 1) {
        item.quantity = 1
        return
      }

      item.quantity = Math.floor(quantity)
    },
    removeItem(productId: number): void {
      this.cartItems = this.cartItems.filter(item => item.product.id !== productId)
    },
    clearCart(): void {
      this.cartItems = []
    },
    confirmClearCart(): void {
      this.confirm.require({
        header: 'Limpar carrinho',
        message: 'Deseja realmente remover todos os itens do carrinho?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: 'Remover tudo',
          severity: 'danger'
        },
        accept: () => {
          this.clearCart()
        }
      })
    },
    applyTheme(isDark: boolean): void {
      this.isDark = isDark
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    },
    toggleTheme(): void {
      this.applyTheme(!this.isDark)
    },
    getProductImage(product: Product): string | undefined {
      return product.image
    }
  },
  mounted() {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      this.applyTheme(storedTheme === 'dark')
    } else {
      this.applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }

    const microcontrollers = new Category(1, 'Microcontroladores')
    const singleBoardComputers = new Category(2, 'Computacao Embarcada')
    const iotPrototyping = new Category(3, 'IoT e Prototipagem')

    this.products = [
      new Product(1, 'Arduino Uno R3', 119.90, microcontrollers, arduinoUnoR3Img),
      new Product(2, 'Raspberry Pi Pico W', 64.90, microcontrollers, raspberryPiPicoWImg),
      new Product(3, 'ESP32 DevKit V1', 58.00, microcontrollers, esp32DevKitV1Img),
      new Product(4, 'STM32 Blue Pill', 39.90, microcontrollers, stm32BluePillImg),
      new Product(5, 'Raspberry Pi 4 Model B (4GB)', 599.00, singleBoardComputers, raspberryPi4ModelBImg),
      new Product(6, 'Jetson Nano Developer Kit', 1299.00, singleBoardComputers, jetsonNanoDeveloperKitImg),
      new Product(7, 'NodeMCU ESP8266', 44.90, iotPrototyping, nodeMcuEsp8266Img),
      new Product(8, 'Teensy 4.1', 289.00, iotPrototyping, teensy41Img),
    ]
  }
})
</script>
