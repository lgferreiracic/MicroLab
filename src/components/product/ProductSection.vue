<template>
  <section class="mx-auto w-full max-w-440 px-4 py-8 sm:px-6 lg:px-12">
    <div v-if="isLoading" class="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      Carregando produtos...
    </div>

    <div v-else-if="errorMessage" class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
      {{ errorMessage }}
    </div>

    <div v-else-if="!sections.length" class="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      Nenhum produto encontrado.
    </div>

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
import raspberryProduct from '../../assets/products/raspberry.png'
import { getCatalogProducts, type ProductCatalogItem } from '../../services/product.service'

type ProductCardItem = {
  id: number
  name: string
  image: string
  price: number
  installments: number
}

type ProductSectionItem = {
  id: string
  title: string
  image: string
  products: ProductCardItem[]
}

export default defineComponent({
  name: 'ProductSection',
  components: {
    Carousel,
    ProductCard
  },
  data() {
    return {
      sections: [] as ProductSectionItem[],
      isLoading: true,
      errorMessage: ''
    }
  },
  async created() {
    await this.loadSections()
  },
  methods: {
    async loadSections(): Promise<void> {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const products = await getCatalogProducts()
        this.sections = this.groupByCategory(products)
      } catch (error) {
        this.sections = []
        this.errorMessage = error instanceof Error ? error.message : 'Nao foi possivel carregar os produtos.'
      } finally {
        this.isLoading = false
      }
    },
    groupByCategory(products: ProductCatalogItem[]): ProductSectionItem[] {
      const grouped = new Map<string, ProductSectionItem>()

      products.forEach((product) => {
        const sectionKey = `${product.category_id}-${product.category_name}`
        const sectionId = this.slugify(product.category_name)
        const image = this.resolveProductImage(product)

        if (!grouped.has(sectionKey)) {
          grouped.set(sectionKey, {
            id: sectionId,
            title: product.category_name,
            image: this.resolveCategoryCover(product.category_name, image),
            products: []
          })
        }

        grouped.get(sectionKey)?.products.push({
          id: product.product_id,
          name: product.name,
          image,
          price: product.price,
          installments: this.calculateInstallments(product.price)
        })
      })

      return Array.from(grouped.values())
    },
    resolveProductImage(product: ProductCatalogItem): string {
      const description = this.toRecord(product.description)
      const img = this.toRecord(product.img)
      const descBanner = this.toText(description?.banner)
      const imgBanner = this.toText(img?.banner)

      if (imgBanner) {
        return imgBanner
      }

      if (descBanner) {
        return descBanner
      }

      return this.resolveCategoryCover(product.category_name)
    },
    resolveCategoryCover(categoryName: string, fallback = ''): string {
      const normalized = categoryName.toLowerCase()

      if (normalized.includes('arduino')) {
        return arduinoProduct
      }

      if (normalized.includes('raspberry')) {
        return raspberryProduct
      }

      return fallback || arduinoProduct
    },
    calculateInstallments(price: number): number {
      if (price >= 500) {
        return 12
      }

      if (price >= 250) {
        return 10
      }

      return 6
    },
    slugify(value: string): string {
      return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    },
    toRecord(value: unknown): Record<string, unknown> | null {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null
      }

      return value as Record<string, unknown>
    },
    toText(value: unknown): string {
      return typeof value === 'string' ? value : ''
    }
  }
})
</script>
