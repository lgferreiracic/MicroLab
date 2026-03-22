<template>
  <div class="relative">
    <nav class="h-28 border-b border-brand-tertiary/40 bg-brand-primary text-white">
      <div class="mx-auto flex h-full w-full max-w-7xl px-6 sm:px-10 lg:px-12">
      <div class="flex h-full w-1/5 items-center justify-center border-r border-white/20 px-2">
        <slot name="logo">
          <img :src="logoSrc" :alt="logoText" class="h-12 w-auto object-contain" />
        </slot>
      </div>

      <div class="flex h-full w-[55%] items-start justify-center px-4 pt-2">
        <div class="flex h-full w-full max-w-2xl flex-col">
          <div class="h-1/2 w-full">
            <IconField class="h-full w-full">
              <InputText
                v-model="searchTerm"
                :placeholder="searchPlaceholder"
                class="h-full w-full"
                @keyup.enter="handleSearch"
              />
              <InputIcon class="pi pi-search text-slate-400" />
            </IconField>
          </div>

          <div class="mt-2 flex items-stretch gap-2">
            <button
              type="button"
              class="inline-flex w-64 items-stretch gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-tight text-white transition-colors duration-200 hover:bg-brand-tertiary"
              @click="toggleZipPopover"
            >
              <span class="flex min-h-full items-center justify-center px-1">
                <i class="pi pi-map-marker text-[2.3rem] leading-none"></i>
              </span>
              <span>
                Enviar para:<br />
                {{ deliveryZip }}, {{ deliveryCity }}
              </span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-brand-tertiary"
              @click="toggleCategoriesPopover"
            >
              <i class="pi pi-bars text-base"></i>
              <span>Categorias</span>
            </button>
          </div>

          <Popover
            ref="zipPopover"
            :pt="{ content: { class: 'bg-brand-primary text-white border border-brand-tertiary/40 rounded-md' } }"
          >
            <div class="flex w-64 flex-col gap-3 p-1">
              <p class="m-0 text-sm font-medium text-white">Digite seu CEP</p>
              <InputMask
                v-model="editableZip"
                mask="99999-999"
                placeholder="00000-000"
                class="w-full"
                @keyup.enter="applyZip"
              />
              <Button label="Atualizar" size="small" severity="secondary" :loading="isUpdatingZip" @click="applyZip" />
            </div>
          </Popover>

        </div>
      </div>

      <div class="flex h-full w-1/4 items-start justify-end gap-2 px-3 pt-2">
        <Button
          label="Favoritos"
          icon="pi pi-heart"
          text
          class="whitespace-nowrap !text-white hover:!bg-brand-tertiary hover:!text-white transition-colors duration-200"
          @click="handleFavorites"
        />
        <Button
          label="Entrar"
          icon="pi pi-user"
          text
          class="whitespace-nowrap !text-white hover:!bg-brand-tertiary hover:!text-white transition-colors duration-200"
          @click="handleLogin"
        />
        <Button
          icon="pi pi-shopping-cart"
          aria-label="Carrinho"
          text
          class="h-10 w-10 !text-white hover:!bg-brand-tertiary hover:!text-white transition-colors duration-200"
          @click="handleCart"
        />
      </div>
    </div>
    </nav>

    <div v-if="isCategoriesOpen" class="absolute inset-x-0 top-full z-50 mt-2 px-6 sm:px-10 lg:px-12">
      <div class="mx-auto w-full max-w-7xl rounded-md border border-brand-tertiary/30 bg-white p-4 shadow-lg">
        <p class="m-0 text-sm text-slate-700">Menu de categorias (em construcao)</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Popover from 'primevue/popover'
import InputMask from 'primevue/inputmask'
import logoPng from '../../assets/logo.png'

export default defineComponent({
  name: 'AppNavbar',
  components: {
    Button,
    InputText,
    IconField,
    InputIcon,
    Popover,
    InputMask
  },
  props: {
    logoText: {
      type: String,
      default: 'MicroLab'
    },
    searchPlaceholder: {
      type: String,
      default: 'Pesquisar por...'
    }
  },
  emits: ['search', 'favorites', 'login', 'cart'],
  data() {
    return {
      searchTerm: '',
      logoSrc: logoPng,
      deliveryZip: '00000-000',
      deliveryCity: 'Carregando cidade...',
      editableZip: '00000-000',
      isUpdatingZip: false,
      isCategoriesOpen: false
    }
  },
  mounted() {
    this.loadInitialCity()
  },
  methods: {
    handleSearch(): void {
      this.$emit('search', this.searchTerm)
    },
    handleFavorites(): void {
      this.$emit('favorites')
    },
    handleLogin(): void {
      this.$emit('login')
    },
    handleCart(): void {
      this.$emit('cart')
    },
    toggleZipPopover(event: Event): void {
      const popover = this.$refs.zipPopover as { toggle: (target: Event) => void } | undefined
      popover?.toggle(event)
    },
    toggleCategoriesPopover(): void {
      this.isCategoriesOpen = !this.isCategoriesOpen
    },
    async applyZip(): Promise<void> {
      const normalizedZip = this.editableZip.replace(/\D/g, '')
      if (normalizedZip.length !== 8) {
        return
      }

      this.isUpdatingZip = true

      try {
        const response = await fetch(`https://viacep.com.br/ws/${normalizedZip}/json/`)
        if (!response.ok) {
          throw new Error('Falha ao consultar CEP')
        }

        const data = await response.json() as {
          erro?: boolean
          localidade?: string
          uf?: string
          cep?: string
        }

        if (data.erro) {
          throw new Error('CEP invalido')
        }

        this.deliveryZip = data.cep || this.editableZip
        this.deliveryCity = [data.localidade, data.uf].filter(Boolean).join(' - ') || this.deliveryCity
      } catch {
        // Mantem os valores atuais se a consulta falhar.
      } finally {
        this.isUpdatingZip = false
      }
    },
    async loadInitialCity(): Promise<void> {
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) {
          throw new Error('Falha ao carregar cidade inicial')
        }

        const data = await response.json() as {
          city?: string
          region_code?: string
        }

        const city = data.city?.trim()
        const state = data.region_code?.trim()
        if (city) {
          this.deliveryCity = state ? `${city} - ${state}` : city
          return
        }
      } catch {
        // Fallback padrao abaixo.
      }

      this.deliveryCity = 'Sao Paulo - SP'
    }
  }
})
</script>
