import * as path from 'path'
import { createRoutes } from '@nuxt/utils' // add SortRoutes <-- valid in Nuxt 2.10
import pify from 'pify'
import Glob from 'glob'
import ThemeResolverPlugin from 'webpack-theme-resolver-plugin'

const glob = pify(Glob)

export default function (moduleOptions) {
  this.extendBuild((config) => {
    if (!Array.isArray(config.resolve.plugins)) {
      config.resolve.plugins = []
    }

    config.resolve.plugins.push(
      new ThemeResolverPlugin(moduleOptions.aliases)
    )
  })

  this.nuxt.hook('build:extendRoutes', async (routes, resolve) => {
    const length = routes.length

    for (let i = 0; i < length; i++) {
      routes.pop()
    }

    const generatedRoutes = await generate()
    routes.push(...sortRoutes(generatedRoutes))
  })

  this.nuxt.hook(
    'build:before',
    async ({ templateVars, templatesFiles, resolve }) => {
      const templateFilesPromise = moduleOptions.directories.map((theme) => {
        const srcDir = path.join(moduleOptions.basePath, theme)

        return resolveFiles('layouts', srcDir, true)
      })

      const folders = await Promise.all(templateFilesPromise)

      const files = folders.reduce(filterDuplicateLayouts, [])

      files.forEach((file) => {
        const srcDir = path.parse(path.parse(file).dir).dir
        addFileToTemplates(file, srcDir)
      })
    }
  )

  const generate = async () => {
    const generatedRoutesPromise = moduleOptions.directories.map(
      async (theme) => {
        const srcDir = path.join(moduleOptions.basePath, theme)

        const files = await resolveFiles('pages', srcDir)

        const generatedRoutes = createRoutes({
          files,
          srcDir,
          pagesDir: 'pages',
          routeNameSplitter: this.options.router.routeNameSplitter,
          supportedExtensions: ['vue']
        })

        return generatedRoutes
      }
    )

    const allRoutes = await Promise.all(generatedRoutesPromise)

    return allRoutes.reduce(filterDuplicates, [])
  }

  const filterDuplicates = (AddedRoutes, currentRoutes) => {
    return [
      ...currentRoutes.filter((routeToAdd) => {
        return !AddedRoutes.find((alreadyAddedRoute) => {
          return alreadyAddedRoute.path === routeToAdd.path
        })
      }),
      ...AddedRoutes
    ]
  }

  const filterDuplicateLayouts = (addedLayouts, currentLayouts) => {
    return [
      ...currentLayouts.filter((layoutToAdd) => {
        return !addedLayouts.find((alreadyAddedLayouts) => {
          return path.parse(alreadyAddedLayouts).name === path.parse(layoutToAdd).name
        })
      }),
      ...addedLayouts
    ]
  }

  const addFileToTemplates = (file, srcDir) => {
    const srcName = file.replace(/\//g, path.sep)
    const dstName = file.replace(srcDir.replace(/\\/g, '/') + '/', '')

    this.addLayout({
      src: srcName,
      fileName: dstName
    })
  }

  const resolveFiles = async (
    dir,
    basePath = this.options.srcDir,
    keepPath = false
  ) => {
    const paths = await glob(`${basePath}/${dir}/**/*.vue`)

    const normalizedSrc = basePath.replace(/\\/g, '/') + '/'

    let files = [].concat(paths || [])

    if (!keepPath) {
      files = files.map(page => page.replace(normalizedSrc, ''))
    }

    return files
  }

  // @TODO: this is a temporary fix until Nuxt 2.10 is out where sortRoutes from @nuxt/util is
  // exported. This is a copy of the current working solution. Remove after Nuxt 2.10!!
  const DYNAMIC_ROUTE_REGEX = /^\/([:*])/

  const sortRoutes = (routes) => {
    routes.sort((a, b) => {
      if (!a.path.length) {
        return -1
      }
      if (!b.path.length) {
        return 1
      }
      // Order: /static, /index, /:dynamic
      // Match exact route before index: /login before /index/_slug
      if (a.path === '/') {
        return DYNAMIC_ROUTE_REGEX.test(b.path) ? -1 : 1
      }
      if (b.path === '/') {
        return DYNAMIC_ROUTE_REGEX.test(a.path) ? 1 : -1
      }

      let i
      let res = 0
      let y = 0
      let z = 0
      const _a = a.path.split('/')
      const _b = b.path.split('/')
      for (i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        y = _a[i] === '*' ? 2 : _a[i].includes(':') ? 1 : 0
        z = _b[i] === '*' ? 2 : _b[i].includes(':') ? 1 : 0
        res = y - z
        // If a.length >= b.length
        if (i === _b.length - 1 && res === 0) {
          // unless * found sort by level, then alphabetically
          res =
            _a[i] === '*'
              ? -1
              : _a.length === _b.length
                ? a.path.localeCompare(b.path)
                : _a.length - _b.length
        }
      }

      if (res === 0) {
        // unless * found sort by level, then alphabetically
        res =
          _a[i - 1] === '*' && _b[i]
            ? 1
            : _a.length === _b.length
              ? a.path.localeCompare(b.path)
              : _a.length - _b.length
      }
      return res
    })

    routes.forEach((route) => {
      if (route.children) {
        sortRoutes(route.children)
      }
    })

    return routes
  }
}

module.exports.meta = require('../package.json')
