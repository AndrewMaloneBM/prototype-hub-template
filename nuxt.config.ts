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
    // GitHub Pages serves from /<repo-name>/; CI sets NUXT_APP_BASE_URL (see deploy.yml).
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/bm-avatar.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  nitro: {
    preset: 'static',
    // If you add clean external share URLs (e.g. a /share/<name> route alias),
    // list them here so they're included in the static build:
    // prerender: { routes: ['/share/my-prototype'] },
  },
})
