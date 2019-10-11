jest.setTimeout(60000)

const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')

const config = require('../example/nuxt.config')
config.dev = false

let nuxt, port

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

describe('basic', () => {
  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await nuxt.ready()
    await new Builder(nuxt).build()
    port = await getPort()
    await nuxt.listen(port)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })

  test('special overwrites base', async () => {
    const html = await get('/test1')
    expect(html).toContain('wow!')
  })

  test('base components can be used in special', async () => {
    const html = await get('/test2')
    expect(html).toContain('component from base')
  })

  test('special components can be used in base', async () => {
    const html = await get('/test3')
    expect(html).toContain('component from special')
  })

  test('base uses layout from base', async () => {
    const html = await get('/layouts1')
    expect(html).toContain('layout from base')
  })

  test('base uses layout from special', async () => {
    const html = await get('/layouts2')
    expect(html).toContain('layout from special')
  })

  test('special uses layout from base', async () => {
    const html = await get('/layouts3')
    expect(html).toContain('layout from base')
  })

  test('special overwrites layout from base', async () => {
    const html = await get('/layouts4')
    expect(html).toContain('layout from special')
  })

  test('duplicate get\'s removed', async () => {
    const html = await get('/layouts5')
    expect(html).toContain('layout from special')
  })

  test('error page is shown', async () => {
    try {
      await get('/error')
    } catch (e) {
      expect(e.message).toContain('This is a base error')
    }
  })
})
