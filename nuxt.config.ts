// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@vueuse/nuxt', '@nuxthub/core'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  image: {
    format: ['avif', 'webp', 'png'],
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
  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(file) })
      }

      addPage(
        'products-page',
        '/products/:productSlug',
        './pages/products/[slug].vue'
      )
    },
  },
  nitro: {
    routeRules: {
      '/': { prerender: true },
      '/products/**': { swr: 3600 },
    },
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
    preset: 'cloudflare-pages',
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
