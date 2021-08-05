# nuxt-theme-builder

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

>

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

> **WARNING**: This package got renamed for version 2.2 from `nuxt-theme-builder` to `@russmedia/theme-builder-nuxt`

1. Add `@russmedia/theme-builder-nuxt` dependency to your project

```bash
npm install @russmedia/theme-builder-nuxt
```

2. Add `@russmedia/theme-builder-nuxt` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    ['@russmedia/theme-builder-nuxt', {
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
[npm-version-src]: https://img.shields.io/npm/v/@russmedia/theme-builder-nuxt/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@russmedia/theme-builder-nuxt

[npm-downloads-src]: https://img.shields.io/npm/dt/@russmedia/theme-builder-nuxt.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@russmedia/theme-builder-nuxt

[circle-ci-src]: https://img.shields.io/circleci/project/github/russmediadigital/nuxt-theme-builder.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/russmediadigital/nuxt-theme-builder

[codecov-src]: https://img.shields.io/codecov/c/github/russmediadigital/nuxt-theme-builder.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/russmediadigital/nuxt-theme-builder

[license-src]: https://img.shields.io/npm/l/@russmedia/theme-builder-nuxt.svg?style=flat-square
[license-href]: https://npmjs.com/package/@russmedia/theme-builder-nuxt
