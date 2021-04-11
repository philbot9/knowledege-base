import R from 'ramda'

import { IUserRepository } from '../domain/User/IUserRepository'
import { IException } from '../domain/exceptions/IException'
import { User } from '../domain/User/User'
import { toArray } from '../util/async-iterator'
import { generateId } from '../domain/util/id'

export default function (repo: IUserRepository) {
  describe('create', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    afterEach(async () => {
      try {
        await repo.delete(user.id)
      } catch (e) {}
    })

    it('creates a new user', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(repo.read(user.id)).resolves.toEqual(user)
    })

    it('fails if id already in use', async () => {
      expect.assertions(2)
      await expect(repo.create(user.id, user)).resolves.toEqual(user)

      await repo.create(user.id, user).catch((e: IException) => {
        expect(e.name).toBe('RecordAlreadyExists')
      })
    })
  })

  describe('read', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    afterEach(async () => {
      try {
        await repo.delete(user.id)
      } catch (e) {}
    })

    it('reads an user', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(repo.read(user.id)).resolves.toEqual(user)
    })

    it('fails if user does not exist', async () => {
      expect.assertions(1)
      await repo.read('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('findByEmail', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    afterEach(async () => {
      try {
        await repo.delete(user.id)
      } catch (e) {}
    })

    it('finds a user', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(repo.findByEmail(user.email)).resolves.toEqual(user)
    })

    it('fails if user does not exist', async () => {
      expect.assertions(1)
      await repo.findByEmail('nosuch@user.com').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('update', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    afterEach(async () => {
      try {
        await repo.delete(user.id)
      } catch (e) {}
    })

    it('updates an user', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(
        repo.update(user.id, { lastName: 'Changed' })
      ).resolves.toEqual({
        ...user,
        lastName: 'Changed'
      })
      await expect(repo.read(user.id)).resolves.toEqual({
        ...user,
        lastName: 'Changed'
      })
    })

    it('fails if user does not exist', async () => {
      expect.assertions(1)
      await repo
        .update('test', { lastName: 'Failed' })
        .catch((e: IException) => {
          expect(e.name).toBe('RecordNotFound')
        })
    })
  })

  describe('update', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    afterEach(async () => {
      try {
        await repo.delete(user.id)
      } catch (e) {}
    })

    it('updates an user', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(
        repo.update(user.id, { lastName: 'Changed' })
      ).resolves.toEqual({
        ...user,
        lastName: 'Changed'
      })
      await expect(repo.read(user.id)).resolves.toEqual({
        ...user,
        lastName: 'Changed'
      })
    })

    it('fails if user does not exist', async () => {
      expect.assertions(1)
      await repo
        .update('test', { lastName: 'Failed' })
        .catch((e: IException) => {
          expect(e.name).toBe('RecordNotFound')
        })
    })
  })

  describe('delete', () => {
    const user: User = new User({
      id: generateId(),
      email: 'test@user.com',
      password: 'pass',
      firstName: 'Test',
      lastName: 'User'
    })

    it('deletes an etry', async () => {
      await expect(repo.create(user.id, user)).resolves.toEqual(user)
      await expect(repo.delete(user.id)).resolves.toEqual(user.id)
    })

    it('fails if user does not exist', async () => {
      expect.assertions(1)
      await repo.delete('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('list', () => {
    const users: User[] = []
    beforeAll(async () => {
      for (let i = 0; i < 10; i++) {
        users.push(
          new User({
            id: generateId(),
            email: 'test@user.com',
            password: 'pass',
            firstName: 'Test',
            lastName: `User ${i}`
          })
        )
        await repo.create(users[i].id, users[i])
      }
    })

    afterAll(async () => {
      for (const u of users) {
        await repo.delete(u.id)
      }
    })

    it('lists users', async () => {
      const iter = await repo.list()
      const res = await toArray(iter)

      expect(res).toHaveLength(users.length)
      res.forEach(r => {
        const n = users.find(n => n.id === r.id)
        expect(r).toEqual(n)
      })
    })

    it('supports limit', async () => {
      const iter = await repo.list({ limit: 5 })
      const res = await toArray(iter)
      expect(res).toHaveLength(5)
    })

    it('supports offset', async () => {
      const iter = await repo.list({ offset: 5 })
      const res = await toArray(iter)
      expect(res).toHaveLength(5)
    })

    it('supports offset and limit', async () => {
      const iter = await repo.list({ offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toHaveLength(2)
    })

    it('supports sort', async () => {
      const iterAsc = await repo.list({ sort: { lastName: 1 } })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(users)

      const iterDesc = await repo.list({ sort: { lastName: -1 } })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(users))
    })

    it('performs sort and then limit', async () => {
      const iterAsc = await repo.list({ sort: { lastName: 1 }, limit: 5 })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(users.slice(0, 5))

      const iterDesc = await repo.list({ sort: { lastName: -1 }, limit: 5 })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(users).slice(0, 5))
    })

    it('supports all args', async () => {
      const iter = await repo.list({
        sort: { lastName: -1 },
        offset: 5,
        limit: 2
      })
      const res = await toArray(iter)
      expect(res).toEqual(R.reverse(users).slice(5, 7))
    })
  })
}
