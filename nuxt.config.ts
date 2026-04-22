export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  nitro: {
    preset: 'static',
  },
})
