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
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'Bem-vindo a MicroLab'
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
})
</script>
