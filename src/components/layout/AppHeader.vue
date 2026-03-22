<template>
  <header class="border-b border-brand-tertiary/30 bg-brand-primary dark:bg-slate-950">
    <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
      <div class="flex min-w-0 items-baseline gap-3">
        <p class="m-0 text-sm font-semibold tracking-tight text-white">
          {{ title }}
        </p>
        <p v-if="subtitle" class="m-0 text-sm text-slate-600 dark:text-slate-300 sm:pl-8">
          {{ subtitle }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          v-if="isAdminUser"
          :to="{ name: 'admin' }"
          class="inline-flex items-center rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Painel Admin
        </RouterLink>
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { getCurrentAuthUser } from '../../services/auth.service'

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink
  },
  props: {
    title: {
      type: String,
      default: 'Bem-vindo a MicroLab'
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isAdminUser: false,
      authSubscription: null as { unsubscribe: () => void } | null
    }
  },
  mounted() {
    void this.loadAdminStatus()

    const authListener = supabase.auth.onAuthStateChange(() => {
      void this.loadAdminStatus()
    })
    this.authSubscription = authListener.data.subscription
  },
  beforeUnmount() {
    this.authSubscription?.unsubscribe()
    this.authSubscription = null
  },
  methods: {
    async loadAdminStatus(): Promise<void> {
      this.isAdminUser = false

      const authUser = await getCurrentAuthUser()
      if (!authUser) {
        return
      }

      const byAuthUid = await supabase
        .from('users')
        .select('role:role_id(name)')
        .eq('auth_uid', authUser.id)
        .maybeSingle()

      let roleData = byAuthUid.data?.role as any

      if (!roleData && authUser.email) {
        const byEmail = await supabase
          .from('users')
          .select('role:role_id(name)')
          .eq('email', authUser.email)
          .maybeSingle()

        roleData = byEmail.data?.role as any
      }

      const role = Array.isArray(roleData) ? roleData[0] : roleData
      this.isAdminUser = String(role?.name || '').toUpperCase() === 'ADMIN'
    }
  }
})
</script>
