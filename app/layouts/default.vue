<template>
  <div class="min-h-screen flex flex-col">
    <!-- Back office top nav -->
    <header class="bg-bm-black border-b border-bm-gray-800 px-6 py-3 flex items-center gap-6">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-bm-green-500 font-display text-lg font-bold tracking-tight">Back Market</span>
        <span class="text-bm-gray-500 text-xs">/ Seller XP Prototypes</span>
      </NuxtLink>
      <nav class="ml-auto flex items-center gap-1">
        <NuxtLink
          to="/"
          class="px-3 py-1.5 rounded-bm-sm text-sm text-bm-gray-300 hover:text-white hover:bg-bm-gray-800 transition-colors"
        >
          Hub
        </NuxtLink>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
