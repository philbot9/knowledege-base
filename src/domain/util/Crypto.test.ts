import { Crypto } from './Crypto'

describe('Crypto', () => {
  it('encrypts a password', async () => {
    const crypto = new Crypto()

    const hashed = await crypto.hash('my-password')
    expect(typeof hashed).toBe('string')
    expect(hashed.length).toBeGreaterThan(1)
    expect(crypto.compare(hashed, 'my-password')).resolves.toBe(true)
  })
})
