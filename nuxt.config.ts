// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@vueuse/nuxt',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
  ,

  devtools: { enabled: true },
  ssr: false,
  devServer: {
    https: {
      key: 'C:/Users/virgi/rootCA/ca.key',
      cert: 'C:/Users/virgi/rootCA/ca.crt'
    }
  }
})
