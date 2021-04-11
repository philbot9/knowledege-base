import { generateId } from '../util/id'
import { User } from './User'

describe('User', () => {
  it('instantiates', async () => {
    const user = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    expect(typeof user.id).toBe('string')
    expect(user.id.length).toBeGreaterThan(1)
    expect(user.email).toBe('test@user.com')
    expect(user.firstName).toBe('Test')
    expect(user.lastName).toBe('User')
  })

  it('toJson()', () => {
    const user = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    expect(JSON.parse(user.toJson())).toEqual({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    })
  })
})
