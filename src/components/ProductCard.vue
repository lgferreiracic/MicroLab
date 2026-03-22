<template>
  <Card class="h-full p-4 shadow-lg rounded-xl">
    <template #title>
      <h3 class="m-0 h-10 overflow-hidden text-base font-semibold leading-5">
        {{ product.name }}
      </h3>
    </template>

    <template #content>
      <div class="flex h-full flex-col justify-center gap-3">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-28 w-full rounded-md object-cover"
        />
        <div
          v-else
          class="flex h-28 w-full items-center justify-center rounded-md bg-slate-100 text-slate-500"
        >
          <i class="pi pi-image"></i>
        </div>
        <span class="w-fit rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
          {{ product.category.name }}
        </span>
        <p class="m-0 text-lg font-bold text-emerald-600">
          R$ {{ product.price.toFixed(2) }}
        </p>
      </div>
    </template>

    <template #footer>
      <Button label="Adicionar" class="w-full" @click="handleAdd" />
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { Product } from '../model/product.model'

export default defineComponent({
  name: 'ProductCard',
  components: {
    Card,
    Button
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  methods: {
    handleAdd(): void {
      this.$emit('add-to-cart', this.product)
    }
  }
})
</script>
