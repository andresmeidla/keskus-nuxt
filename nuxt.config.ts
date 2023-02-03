// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['toastify-js/src/toastify.css', '@/assets/css/main.css', 'floating-vue/dist/style.css', '@vueup/vue-quill/dist/vue-quill.snow.css'],
  modules: ['@nuxt/image-edge', 'nuxt-icon', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  runtimeConfig: {
    jwtSecret: '0h23tg9f7hwab19g72',
    webAddress: 'https://keskus.meidla.com',
    emailPassword: 'password',
    emailAddress: 'keskus.mail@gmail.com',
    emailSender: '"Keskus" <keskus.mail@gmail.com>',
    emailProtocol: 'smtps',
    emailHost: 'smtp.gmail.com',
    emailPort: 465,
    emailsToAllEnabled: false,
    public: {
      apiUrl: '/api',
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  typescript: {
    shim: false,
    strict: true,
  },
  colorMode: {
    preference: 'system', // default theme
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
});
