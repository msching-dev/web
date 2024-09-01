// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@vueuse/nuxt'],
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  image: {
    format: ['avif', 'webp', 'png']
  },
  colorMode: {
    preference: 'light'
  }
})
