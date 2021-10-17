


import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  bridge: false,
  // Your existing configuration
  server: {
    host: '0.0.0.0'
  },
  modules: ['@nuxtjs/strapi'],
  strapi: {
    // Options
    entities: ['orders'],
    expires: '31d'

  }

})