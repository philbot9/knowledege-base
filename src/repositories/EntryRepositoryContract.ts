import R from 'ramda'

import { Entry } from '../domain/Entry/Entry'
import { IEntryRepository } from '../domain/Entry/IEntryRepository'
import { NoteEntry } from '../domain/Entry/NoteEntry'
import { IException } from '../domain/exceptions/IException'
import { toArray } from '../util/async-iterator'
import { generateId } from '../domain/util/id'
import { UrlEntry } from '../domain/Entry/UrlEntry'

export default async function (repo: IEntryRepository) {
  describe('create', () => {
    const entry: Entry = new NoteEntry({
      id: generateId(),
      title: 'Test',
      userId: generateId(),
      noteId: generateId()
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('creates a new entry', async () => {
      await expect(repo.create(entry.id, entry)).resolves.toEqual(entry)
      await expect(repo.read(entry.id)).resolves.toEqual(entry)
    })

    it('fails if id already in use', async () => {
      expect.assertions(2)
      await expect(repo.create(entry.id, entry)).resolves.toEqual(entry)

      await repo.create(entry.id, entry).catch((e: IException) => {
        expect(e.name).toBe('RecordAlreadyExists')
      })
    })

    it('supports UrlEntry', async () => {
      const urlEntry = new UrlEntry({
        id: generateId(),
        title: 'TestUrl',
        userId: generateId(),
        url: 'http://test.com'
      })
      await expect(repo.create(urlEntry.id, urlEntry)).resolves.toEqual(
        urlEntry
      )
      await expect(repo.read(urlEntry.id)).resolves.toEqual(urlEntry)
      await expect(repo.delete(urlEntry.id)).resolves.toEqual(urlEntry.id)
    })
  })

  describe('read', () => {
    const entry: Entry = new NoteEntry({
      id: generateId(),
      title: 'Test',
      userId: generateId(),
      noteId: generateId()
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('reads an entry', async () => {
      await expect(repo.create(entry.id, entry)).resolves.toEqual(entry)
      await expect(repo.read(entry.id)).resolves.toEqual(entry)
    })

    it('fails if entry does not exist', async () => {
      expect.assertions(1)
      await repo.read('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('update', () => {
    const entry: Entry = new NoteEntry({
      id: generateId(),
      title: 'Test',
      userId: generateId(),
      noteId: generateId()
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('updates an entry', async () => {
      await expect(repo.create(entry.id, entry)).resolves.toEqual(entry)
      await expect(
        repo.update(entry.id, { title: 'Changed' })
      ).resolves.toEqual({ ...entry, title: 'Changed' })
      await expect(repo.read(entry.id)).resolves.toEqual({
        ...entry,
        title: 'Changed'
      })
    })

    it('fails if entry does not exist', async () => {
      expect.assertions(1)
      await repo.update('test', { title: 'Failed' }).catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('delete', () => {
    const entry: Entry = new NoteEntry({
      id: generateId(),
      title: 'Test',
      userId: generateId(),
      noteId: generateId()
    })

    it('deletes an etry', async () => {
      await expect(repo.create(entry.id, entry)).resolves.toEqual(entry)
      await expect(repo.delete(entry.id)).resolves.toEqual(entry.id)
    })

    it('fails if entry does not exist', async () => {
      expect.assertions(1)
      await repo.delete('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('list', () => {
    const entries: Entry[] = []
    beforeAll(async () => {
      for (let i = 0; i < 10; i++) {
        entries.push(
          new NoteEntry({
            id: generateId(),
            title: 'Test ' + i,
            userId: generateId(),
            noteId: generateId()
          })
        )
        await repo.create(entries[i].id, entries[i])
      }
    })

    afterAll(async () => {
      for (const e of entries) {
        await repo.delete(e.id)
      }
    })

    it('lists entries', async () => {
      const iter = await repo.list()
      const res = await toArray(iter)
      expect(res).toHaveLength(entries.length)
      res.forEach(r => {
        const entry = entries.find(e => e.id === r.id)
        expect(r).toEqual(entry)
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
      const iterAsc = await repo.list({ sort: { title: 1 } })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(entries)

      const iterDesc = await repo.list({ sort: { title: -1 } })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(entries))
    })

    it('supports sort and limit', async () => {
      const iterAsc = await repo.list({ sort: { title: 1 }, limit: 5 })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(entries.slice(0, 5))

      const iterDesc = await repo.list({ sort: { title: -1 }, limit: 5 })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(entries).slice(0, 5))
    })

    it('supports all args', async () => {
      const iter = await repo.list({ sort: { title: -1 }, offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toEqual(R.reverse(entries).slice(5, 7))
    })
  })

  describe('listByUser', () => {
    const entries: Entry[] = []
    const userId = generateId()
    const userEntries: Entry[] = []
    beforeAll(async () => {
      for (let i = 0; i < 30; i++) {
        entries.push(
          new NoteEntry({
            id: generateId(),
            title: 'Test ' + `0${i}`.slice(-2),
            userId: i % 3 === 0 ? userId : generateId(),
            noteId: generateId()
          })
        )

        if (entries[i].userId === userId) {
          userEntries.push(entries[i])
        }

        await repo.create(entries[i].id, entries[i])
      }
    })

    afterAll(async () => {
      for (const e of entries) {
        await repo.delete(e.id)
      }
    })

    it('lists user entries', async () => {
      const iter = await repo.listByUser(userId)
      const res = await toArray(iter)
      expect(res).toHaveLength(10)
      res.forEach(r => {
        const entry = entries.find(e => e.id === r.id)
        expect(r).toEqual(entry)
      })

      const iterNone = await repo.listByUser('test')
      const resNone = await toArray(iterNone)
      expect(resNone).toEqual([])
    })

    it('supports limit', async () => {
      const iter = await repo.listByUser(userId, { limit: 5 })
      const res = await toArray(iter)
      expect(res).toHaveLength(5)
    })

    it('supports offset', async () => {
      const iter = await repo.listByUser(userId, { offset: 5 })
      const res = await toArray(iter)
      expect(res).toHaveLength(5)
    })

    it('supports offset and limit', async () => {
      const iter = await repo.listByUser(userId, { offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toHaveLength(2)
    })

    it('supports sort', async () => {
      const iterAsc = await repo.listByUser(userId, { sort: { title: 1 } })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(userEntries)

      const iterDesc = await repo.listByUser(userId, { sort: { title: -1 } })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(userEntries))
    })

    it('supports sort and limit', async () => {
      const iterAsc = await repo.listByUser(userId, {
        sort: { title: 1 },
        limit: 5
      })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(userEntries.slice(0, 5))

      const iterDesc = await repo.listByUser(userId, {
        sort: { title: -1 },
        limit: 5
      })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(userEntries).slice(0, 5))
    })

    it('supports all args', async () => {
      const iter = await repo.listByUser(userId, {
        sort: { title: -1 },
        offset: 5,
        limit: 2
      })
      const res = await toArray(iter)
      expect(res).toEqual(R.reverse(userEntries).slice(5, 7))
    })
  })
}
