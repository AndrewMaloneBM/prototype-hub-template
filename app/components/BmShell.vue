<script setup lang="ts">
withDefaults(defineProps<{
  navItems: readonly string[]
  activeNavItem: string
  sellerName: string
  pageTitle?: string
  tabs?: readonly string[]
  activeTab?: string
  navDotPredicate?: (item: string) => boolean
}>(), {
  pageTitle: undefined,
  tabs: undefined,
  activeTab: undefined,
  navDotPredicate: undefined,
})

const emit = defineEmits<{
  'update:activeTab': [value: string]
  'navItemClick': [item: string]
}>()
</script>

<template>
  <div>
    <div class="sticky top-0 z-30 bg-bm-surface">
      <header class="border-b border-bm-border">
        <div class="flex items-center gap-4 px-8 h-14">
          <img src="/bm-logo.svg" alt="Back Market" class="h-8 w-auto select-none" />
          <div class="flex items-center gap-3 ml-6">
            <span class="text-sm text-bm-text-mid">Hello <strong class="font-semibold text-bm-text-hi">{{ sellerName }}</strong></span>
            <button class="border border-bm-border-action rounded-bm-sm px-3 py-1 text-xs text-bm-text-low hover:bg-bm-gray-100 transition-colors">Leave seller view</button>
          </div>
          <div class="ml-auto flex items-center gap-1">
            <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-bm-text-hi bg-bm-gray-100 hover:bg-bm-gray-200 rounded-bm transition-colors">
              <span>Sales</span>
              <svg class="w-4 h-4 text-bm-text-muted" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
            </button>
            <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-bm-text-hi bg-bm-gray-100 hover:bg-bm-gray-200 rounded-bm transition-colors">
              <span>English (Ireland)</span>
              <svg class="w-4 h-4 text-bm-text-muted" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
            </button>
            <button class="ml-1 w-8 h-8 rounded-full bg-bm-gray-100 border border-bm-border flex items-center justify-center hover:bg-bm-gray-200 transition-colors">
              <svg class="w-4 h-4 text-bm-text-muted" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <nav class="bg-bm-surface border-b border-bm-border">
        <div class="px-8 flex items-center">
          <button
            v-for="item in navItems"
            :key="item"
            :class="['relative px-4 py-3 text-sm transition-colors border-b-2 whitespace-nowrap', item === activeNavItem ? 'font-semibold text-bm-text-hi border-bm-text-hi' : 'font-normal text-bm-text-muted border-transparent hover:text-bm-text-mid hover:border-bm-gray-300']"
            @click="emit('navItemClick', item)"
          >
            {{ item }}
            <span
              v-if="navDotPredicate?.(item)"
              class="absolute top-2.5 right-1.5 w-1.5 h-1.5 rounded-full bg-bm-success"
            />
          </button>
        </div>
      </nav>
    </div>

    <template v-if="pageTitle && tabs">
      <div class="px-8">
        <h1 class="text-3xl font-bold text-bm-text-hi mt-6 mb-4">{{ pageTitle }}</h1>

        <div class="border-b border-bm-border flex items-center">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="['px-5 py-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px', tab === activeTab ? 'font-semibold text-bm-text-hi border-bm-text-hi' : 'font-normal text-bm-text-muted border-transparent hover:text-bm-text-mid hover:border-bm-gray-300']"
            @click="emit('update:activeTab', tab)"
          >{{ tab }}</button>
          <slot name="tabs-extra" />
        </div>

        <slot />
      </div>
    </template>
    <slot v-else name="custom" />
  </div>
</template>
