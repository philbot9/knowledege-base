import { isDev } from './is-dev'

const DEV_COOKIE_KEY = 'dev_cookie_key'

export type Config = {
  cookieKeys: string[]
}

let _config: Config

export function config(rebuild = false): Config {
  if (_config && !rebuild) return _config

  _config = {
    cookieKeys: getCookieKeys()
  }

  return _config
}

function getCookieKeys(): string[] {
  let keys: string[] = []
  let i = 1
  let key = getEnv(`COOKIE_KEY_${i}`)
  while (key && i < 10) {
    keys.push(key)
    key = getEnv(`COOKIE_KEY_${++i}`)
  }

  if (!keys.length) {
    const singleKey = getRequiredProductionEnv('COOKIE_KEY')
    keys.push(singleKey || DEV_COOKIE_KEY)
  }

  return keys
}

function getEnv(name: string): string | undefined {
  return process.env[name]
}

function getRequiredProductionEnv(name: string): string | undefined {
  const val = getEnv(name)
  if (!isDev() && !val) {
    throw new Error('Missing required environment variable ' + name)
  }
  return val
}
