<template>
  <div class="relative">
    <nav
      class="border-b border-brand-tertiary/40 bg-brand-primary text-white shadow-sm"
      :class="isCompact ? 'fixed inset-x-0 top-0 z-[70]' : 'sticky top-0 z-[60]'"
    >
      <div v-if="isCompact" class="mx-auto flex h-20 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 md:px-10 lg:px-12">
        <div class="flex items-center justify-center">
          <RouterLink :to="{ name: 'home' }" aria-label="Ir para home" class="inline-flex items-center justify-center">
            <slot name="logo">
              <img :src="logoSrc" :alt="logoText" class="h-12 w-auto object-contain" />
            </slot>
          </RouterLink>
        </div>

        <div class="min-w-0 flex-1">
          <IconField class="h-full w-full">
            <InputText
              v-model="searchTerm"
              :placeholder="searchPlaceholder"
              class="h-11 w-full"
              @keyup.enter="handleSearch"
            />
            <InputIcon class="pi pi-search text-slate-400" />
          </IconField>
        </div>

        <div class="hidden items-center justify-end gap-2 md:flex">
          <Button
            label="Favoritos"
            icon="pi pi-heart"
            text
            class="whitespace-nowrap text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleFavorites"
          />
          <Button
            :label="loginButtonLabel"
            icon="pi pi-user"
            text
            class="whitespace-nowrap text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleLogin"
          />
          <Button
            icon="pi pi-shopping-cart"
            aria-label="Carrinho"
            text
            class="h-10 w-10 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleCart"
          />
        </div>

        <div class="flex items-center gap-1 md:hidden">
          <Button
            icon="pi pi-heart"
            aria-label="Favoritos"
            text
            class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleFavorites"
          />
          <Button
            icon="pi pi-user"
            aria-label="Entrar"
            text
            class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleLogin"
          />
          <Button
            icon="pi pi-shopping-cart"
            aria-label="Carrinho"
            text
            class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleCart"
          />
        </div>
      </div>

      <div v-else class="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:h-28 md:flex-row md:gap-0 md:px-10 md:py-0 lg:px-12">
        <div class="flex h-12 w-full items-center justify-center border-b border-white/20 pb-2 md:h-full md:w-1/5 md:border-b-0 md:border-r md:px-2 md:pb-0">
          <RouterLink :to="{ name: 'home' }" aria-label="Ir para home" class="inline-flex items-center justify-center">
            <slot name="logo">
              <img :src="logoSrc" :alt="logoText" class="h-12 w-auto object-contain" />
            </slot>
          </RouterLink>
        </div>

        <div class="flex w-full items-start justify-center md:h-full md:w-[55%] md:px-4 md:pt-2">
          <div class="flex w-full max-w-2xl flex-col md:h-full">
            <div class="h-11 w-full md:h-1/2">
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
                class="inline-flex min-w-0 flex-1 items-stretch gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-tight text-white transition-colors duration-200 hover:bg-brand-tertiary md:w-64 md:flex-none"
                @click="toggleZipPopover"
              >
                <span class="flex min-h-full items-center justify-center px-1">
                  <i class="pi pi-map-marker text-[2.3rem] leading-none"></i>
                </span>
                <span>
                  <span class="md:hidden">Enviar para:<br />{{ deliveryCity }}</span>
                  <span class="hidden md:inline">Enviar para:<br />{{ deliveryZip }}, {{ deliveryCity }}</span>
                </span>
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-brand-tertiary"
                @click="toggleCategoriesPopover"
              >
                <i class="pi pi-bars text-base"></i>
                <span>Categorias</span>
              </button>

              <div class="ml-auto flex items-center gap-1 md:hidden">
                <Button
                  icon="pi pi-heart"
                  aria-label="Favoritos"
                  text
                  class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
                  @click="handleFavorites"
                />
                <Button
                  icon="pi pi-user"
                  aria-label="Entrar"
                  text
                  class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
                  @click="handleLogin"
                />
                <Button
                  icon="pi pi-shopping-cart"
                  aria-label="Carrinho"
                  text
                  class="h-9 w-9 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
                  @click="handleCart"
                />
              </div>
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

        <div class="hidden h-full w-1/4 items-start justify-end gap-2 px-3 pt-2 md:flex">
          <Button
            label="Favoritos"
            icon="pi pi-heart"
            text
            class="whitespace-nowrap text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleFavorites"
          />
          <Button
            :label="loginButtonLabel"
            icon="pi pi-user"
            text
            class="whitespace-nowrap text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleLogin"
          />
          <Button
            icon="pi pi-shopping-cart"
            aria-label="Carrinho"
            text
            class="h-10 w-10 text-white! hover:bg-brand-tertiary! hover:text-white! transition-colors duration-200"
            @click="handleCart"
          />
        </div>
      </div>
    </nav>

    <div :class="isCompact ? 'h-20' : 'h-0'"></div>

    <div v-if="isCategoriesOpen && !isCompact" class="absolute inset-x-0 top-full z-50 mt-2 px-6 sm:px-10 lg:px-12">
      <div class="mx-auto w-full max-w-7xl rounded-md border border-brand-tertiary/30 bg-white p-4 shadow-lg">
        <p class="m-0 text-sm font-medium text-slate-700">Categorias</p>

        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div class="rounded-md border border-slate-200 px-3 py-2">
            <p class="m-0 text-sm font-semibold text-brand-primary">Arduino</p>
          </div>

          <div class="rounded-md border border-slate-200 px-3 py-2">
            <p class="m-0 text-sm font-semibold text-brand-primary">Raspberry</p>
          </div>

          <div class="rounded-md border border-slate-200 px-3 py-2">
            <p class="m-0 text-sm font-semibold text-brand-primary">IoT</p>
          </div>

          <div class="rounded-md border border-slate-200 px-3 py-2">
            <p class="m-0 text-sm font-semibold text-brand-primary">Sensores</p>
          </div>

          <div class="rounded-md border border-slate-200 px-3 py-2">
            <p class="m-0 text-sm font-semibold text-brand-primary">Impressoras 3D</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Popover from 'primevue/popover'
import InputMask from 'primevue/inputmask'
import { supabase } from '../../lib/supabase'
import { getCurrentAuthUser } from '../../services/auth.service'
import logoPng from '../../assets/logo.png'

export default defineComponent({
  name: 'AppNavbar',
  components: {
    RouterLink,
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
      isCategoriesOpen: false,
      isCompact: false,
      userFirstName: '',
      authSubscription: null as { unsubscribe: () => void } | null
    }
  },
  computed: {
    loginButtonLabel(): string {
      return this.userFirstName || 'Entrar'
    }
  },
  mounted() {
    this.loadInitialCity()
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.loadUserFirstName()

    const authListener = supabase.auth.onAuthStateChange(() => {
      this.loadUserFirstName()
    })
    this.authSubscription = authListener.data.subscription
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    this.authSubscription?.unsubscribe()
    this.authSubscription = null
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
    async loadUserFirstName(): Promise<void> {
      this.userFirstName = ''

      try {
        const authUser = await getCurrentAuthUser()
        if (!authUser) {
          return
        }

        const byAuthUid = await supabase
          .from('users')
          .select('name')
          .eq('auth_uid', authUser.id)
          .maybeSingle()

        const fullName = (byAuthUid.data?.name || '').trim()
        if (fullName) {
          this.userFirstName = fullName.split(/\s+/)[0]
          return
        }

        const byEmail = await supabase
          .from('users')
          .select('name')
          .eq('email', authUser.email || '')
          .maybeSingle()

        const nameFromEmailLookup = (byEmail.data?.name || '').trim()
        if (nameFromEmailLookup) {
          this.userFirstName = nameFromEmailLookup.split(/\s+/)[0]
          return
        }

        const metadataName = typeof authUser.user_metadata?.name === 'string' ? authUser.user_metadata.name.trim() : ''
        if (metadataName) {
          this.userFirstName = metadataName.split(/\s+/)[0]
          return
        }

        const fallbackEmail = authUser.email || ''
        if (fallbackEmail.includes('@')) {
          this.userFirstName = fallbackEmail.split('@')[0]
        }
      } catch {
        this.userFirstName = ''
      }
    },
    handleScroll(): void {
      this.isCompact = window.scrollY > 24
      if (this.isCompact) {
        this.isCategoriesOpen = false
      }
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
