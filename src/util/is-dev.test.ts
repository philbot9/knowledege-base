import { isDev } from './is-dev'

describe('is-dev', () => {
  it('assumes dev by default', () => {
    expect(isDev()).toEqual(true)
  })

  it('assumes dev if not production', () => {
    global.process.env['NODE_ENV'] = 'dev'
    expect(isDev()).toEqual(true)

    global.process.env['NODE_ENV'] = 'blah'
    expect(isDev()).toEqual(true)

    global.process.env['NODE_ENV'] = ''
    expect(isDev()).toEqual(true)
  })

  it('recognises production', () => {
    global.process.env['NODE_ENV'] = 'prod'
    expect(isDev()).toEqual(false)

    global.process.env['NODE_ENV'] = 'production'
    expect(isDev()).toEqual(false)

    global.process.env['NODE_ENV'] = 'PROD'
    expect(isDev()).toEqual(false)

    global.process.env['NODE_ENV'] = 'PRODUCTION'
    expect(isDev()).toEqual(false)
  })
})
