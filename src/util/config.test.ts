import { config } from './config'
import { isDev } from './is-dev'

jest.mock('./is-dev')

describe('config', () => {
  describe('dev', () => {
    beforeEach(() =>
      // @ts-ignore
      isDev.mockReturnValue(true)
    )

    it('builds default config', () => {
      expect(config(true)).toMatchObject({
        cookieKeys: ['dev_cookie_key']
      })
    })

    it('is idempotent', () => {
      expect(config()).toEqual(config())
      expect(config(false)).toEqual(config(true))
    })

    it('uses env cookie key', () => {
      global.process.env['COOKIE_KEY'] = 'test_cookie_key'
      expect(config(true)).toMatchObject({
        cookieKeys: ['test_cookie_key']
      })
      delete global.process.env['COOKIE_KEY']
    })

    it('supports multiple cookie keys', () => {
      global.process.env['COOKIE_KEY_1'] = 'first_key'
      global.process.env['COOKIE_KEY_2'] = 'second_key'
      global.process.env['COOKIE_KEY_3'] = 'third_key'

      expect(config(true)).toMatchObject({
        cookieKeys: ['first_key', 'second_key', 'third_key']
      })

      delete global.process.env['COOKIE_KEY_1']
      delete global.process.env['COOKIE_KEY_2']
      delete global.process.env['COOKIE_KEY_3']
    })
  })

  describe('prod', () => {
    beforeEach(() =>
      // @ts-ignore
      isDev.mockReturnValue(false)
    )

    it('uses env cookie key', () => {
      global.process.env['COOKIE_KEY'] = 'test_cookie_key'
      expect(config(true)).toMatchObject({
        cookieKeys: ['test_cookie_key']
      })
      delete global.process.env['COOKIE_KEY']
    })

    it('supports multiple cookie keys', () => {
      global.process.env['COOKIE_KEY_1'] = 'first_key'
      global.process.env['COOKIE_KEY_2'] = 'second_key'
      global.process.env['COOKIE_KEY_3'] = 'third_key'

      expect(config(true)).toMatchObject({
        cookieKeys: ['first_key', 'second_key', 'third_key']
      })

      delete global.process.env['COOKIE_KEY_1']
      delete global.process.env['COOKIE_KEY_2']
      delete global.process.env['COOKIE_KEY_3']
    })

    it('throws if cookie key is missing', () => {
      expect(() => config(true)).toThrowError(/required/)
    })
  })
})
