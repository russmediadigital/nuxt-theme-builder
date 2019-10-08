import * as path from 'path'
import { createRoutes, sortRoutes } from '@nuxt/utils'
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
}

module.exports.meta = require('../package.json')
