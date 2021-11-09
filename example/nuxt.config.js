import { resolve } from 'path'
import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  bridge: true,
  vite: true,
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: resolve(__dirname, 'themes', 'special'),

  buildModules: [
    [
      '../lib/themeBuilder',
      {
        basePath: resolve(__dirname, 'themes'),
        directories: ['special', 'base'],
        aliases: [
          {
            prefix: '~alias',
            directories: [
              resolve(__dirname, 'themes', 'special'),
              resolve(__dirname, 'themes', 'base')
            ]
          }
        ]
      }
    ]
  ]
})
