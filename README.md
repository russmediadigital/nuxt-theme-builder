# nuxt-theme-builder

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

>

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-theme-builder` dependency to your project

```bash
npm install nuxt-theme-builder
```

2. Add `nuxt-theme-builder` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    ['nuxt-theme-builder', {
      basePath: './themes',
      directories: ['special', 'base'],
      aliases: [
        {
          prefix: '~alias',
          directories: [
            './themes/special',
            './themes/base',
          ]
        },
      ]
    }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Julian Martin <julian.martin@russmedia.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-theme-builder/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-theme-builder

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-theme-builder.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-theme-builder

[circle-ci-src]: https://img.shields.io/circleci/project/github/.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/

[codecov-src]: https://img.shields.io/codecov/c/github/.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/

[license-src]: https://img.shields.io/npm/l/nuxt-theme-builder.svg?style=flat-square
[license-href]: https://npmjs.com/package/nuxt-theme-builder
