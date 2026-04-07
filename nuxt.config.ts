// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@vueuse/nuxt', '@sentry/nuxt/module'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  sourceMapsUploadOptions: {
    org: 'tangcheng',
    project: 'photo-guess',
  },
  devtools: { enabled: true },
  ssr: false,
  devServer: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem'
    }
  }
})
