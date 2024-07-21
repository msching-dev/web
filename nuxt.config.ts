// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@vueuse/nuxt'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  image: {
    format: ['avif', 'webp', 'png']
  },
  colorMode: {
    preference: 'light',
  },
  routeRules: {
    '/': { prerender: true },
  },
  typescript: {
    typeCheck: true,
  },
  imports: {
    dirs: ['config/*.ts'],
  },
  nitro: {
    routeRules: {
      '/': { prerender: true },
    },
  },
  app: {
    head: {
      viewport:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2024-07-19',
})
