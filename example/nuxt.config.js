const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: resolve(__dirname, 'themes', 'special'),

  render: {
    resourceHints: false
  },

  modules: [
    { handler: require('../lib/themeBuilder').default,
      options: {
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
    }
  ]
}
