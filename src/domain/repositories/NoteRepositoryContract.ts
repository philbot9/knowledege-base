import R from 'ramda'

import { INoteRepository } from '../Entry/INoteRepository'
import { IException } from '../exceptions/IException'
import { INote } from '../Entry/INote'
import { Note } from '../Entry/Note'
import { toArray } from '../../util/async-iterator'
import { generateId } from '../util/id'

export default function (repo: INoteRepository) {
  describe('create', () => {
    const entry: INote = new Note({
      id: generateId(),
      body: 'Note 1',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('creates a new entry', async () => {
      await expect(repo.create(entry)).resolves.toEqual(entry)
      await expect(repo.read(entry.id)).resolves.toEqual(entry)
    })

    it('fails if id already in use', async () => {
      expect.assertions(2)
      await expect(repo.create(entry)).resolves.toEqual(entry)

      await repo.create(entry).catch((e: IException) => {
        expect(e.name).toBe('RecordAlreadyExists')
      })
    })
  })

  describe('read', () => {
    const entry: INote = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('reads an entry', async () => {
      await expect(repo.create(entry)).resolves.toEqual(entry)
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
    const entry: INote = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('updates an entry', async () => {
      await expect(repo.create(entry)).resolves.toEqual(entry)
      await expect(
        repo.update(entry.id, { body: 'Changed' })
      ).resolves.toEqual({ ...entry, body: 'Changed' })
      await expect(repo.read(entry.id)).resolves.toEqual({
        ...entry,
        body: 'Changed'
      })
    })

    it('fails if entry does not exist', async () => {
      expect.assertions(1)
      await repo.update('test', { body: 'Failed' }).catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('update', () => {
    const entry: INote = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(entry.id)
      } catch (e) {}
    })

    it('updates an entry', async () => {
      await expect(repo.create(entry)).resolves.toEqual(entry)
      await expect(repo.update(entry.id, { body: 'Changed' })).resolves.toEqual(
        {
          ...entry,
          body: 'Changed'
        }
      )
      await expect(repo.read(entry.id)).resolves.toEqual({
        ...entry,
        body: 'Changed'
      })
    })

    it('fails if entry does not exist', async () => {
      expect.assertions(1)
      await repo.update('test', { body: 'Failed' }).catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('delete', () => {
    const entry: INote = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    it('deletes an etry', async () => {
      await expect(repo.create(entry)).resolves.toEqual(entry)
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
    const entries: INote[] = []
    beforeAll(async () => {
      for (let i = 0; i < 10; i++) {
        entries.push(
          new Note({
            id: generateId(),
            body: `Note ${i}`,
            format: 'text'
          })
        )
        await repo.create(entries[i])
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
      expect(res).toEqual(entries)
    })

    it('supports limit', async () => {
      const iter = await repo.list({ limit: 5 })
      const res = await toArray(iter)
      expect(res).toHaveLength(5)
      expect(res).toEqual(entries.slice(0, 5))
    })

    it('supports offset', async () => {
      const iter = await repo.list({ offset: 5 })
      const res = await toArray(iter)
      expect(res).toEqual(entries.slice(5))
    })

    it('supports offset and limit', async () => {
      const iter = await repo.list({ offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toEqual(entries.slice(5, 7))
    })

    it('supports sort', async () => {
      const iterAsc = await repo.list({ sort: { body: 1 } })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(entries)

      const iterDesc = await repo.list({ sort: { body: -1 } })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(entries))
    })

    it('performs sort and then limit', async () => {
      const iterAsc = await repo.list({ sort: { body: 1 }, limit: 5 })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(entries.slice(0, 5))

      const iterDesc = await repo.list({ sort: { body: -1 }, limit: 5 })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(entries).slice(0, 5))
    })

    it('supports all args', async () => {
      const iter = await repo.list({ sort: { body: -1 }, offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toEqual(R.reverse(entries).slice(5, 7))
    })
  })
}
