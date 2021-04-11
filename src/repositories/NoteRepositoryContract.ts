import R from 'ramda'

import { INoteRepository } from '../domain/Entry/INoteRepository'
import { IException } from '../domain/exceptions/IException'
import { Note } from '../domain/Entry/Note'
import { toArray } from '../util/async-iterator'
import { generateId } from '../domain/util/id'

export default function (repo: INoteRepository) {
  describe('create', () => {
    const note: Note = new Note({
      id: generateId(),
      body: 'Note 1',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(note.id)
      } catch (e) {}
    })

    it('creates a new note', async () => {
      await expect(repo.create(note.id, note)).resolves.toEqual(note)
      await expect(repo.read(note.id)).resolves.toEqual(note)
    })

    it('fails if id already in use', async () => {
      expect.assertions(2)
      await expect(repo.create(note.id, note)).resolves.toEqual(note)

      await repo.create(note.id, note).catch((e: IException) => {
        expect(e.name).toBe('RecordAlreadyExists')
      })
    })
  })

  describe('read', () => {
    const note: Note = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(note.id)
      } catch (e) {}
    })

    it('reads an note', async () => {
      await expect(repo.create(note.id, note)).resolves.toEqual(note)
      await expect(repo.read(note.id)).resolves.toEqual(note)
    })

    it('fails if note does not exist', async () => {
      expect.assertions(1)
      await repo.read('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('update', () => {
    const note: Note = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(note.id)
      } catch (e) {}
    })

    it('updates an note', async () => {
      await expect(repo.create(note.id, note)).resolves.toEqual(note)
      await expect(repo.update(note.id, { body: 'Changed' })).resolves.toEqual({
        ...note,
        body: 'Changed'
      })
      await expect(repo.read(note.id)).resolves.toEqual({
        ...note,
        body: 'Changed'
      })
    })

    it('fails if note does not exist', async () => {
      expect.assertions(1)
      await repo.update('test', { body: 'Failed' }).catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('update', () => {
    const note: Note = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    afterEach(async () => {
      try {
        await repo.delete(note.id)
      } catch (e) {}
    })

    it('updates an note', async () => {
      await expect(repo.create(note.id, note)).resolves.toEqual(note)
      await expect(repo.update(note.id, { body: 'Changed' })).resolves.toEqual({
        ...note,
        body: 'Changed'
      })
      await expect(repo.read(note.id)).resolves.toEqual({
        ...note,
        body: 'Changed'
      })
    })

    it('fails if note does not exist', async () => {
      expect.assertions(1)
      await repo.update('test', { body: 'Failed' }).catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('delete', () => {
    const note: Note = new Note({
      id: generateId(),
      body: 'Test',
      format: 'text'
    })

    it('deletes an etry', async () => {
      await expect(repo.create(note.id, note)).resolves.toEqual(note)
      await expect(repo.delete(note.id)).resolves.toEqual(note.id)
    })

    it('fails if note does not exist', async () => {
      expect.assertions(1)
      await repo.delete('test').catch((e: IException) => {
        expect(e.name).toBe('RecordNotFound')
      })
    })
  })

  describe('list', () => {
    const notes: Note[] = []
    beforeAll(async () => {
      for (let i = 0; i < 10; i++) {
        notes.push(
          new Note({
            id: generateId(),
            body: `Note ${i}`,
            format: 'text'
          })
        )
        await repo.create(notes[i].id, notes[i])
      }
    })

    afterAll(async () => {
      for (const e of notes) {
        await repo.delete(e.id)
      }
    })

    it('lists notes', async () => {
      const iter = await repo.list()
      const res = await toArray(iter)

      expect(res).toHaveLength(notes.length)
      res.forEach(r => {
        const n = notes.find(n => n.id === r.id)
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
      const iterAsc = await repo.list({ sort: { body: 1 } })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(notes)

      const iterDesc = await repo.list({ sort: { body: -1 } })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(notes))
    })

    it('performs sort and then limit', async () => {
      const iterAsc = await repo.list({ sort: { body: 1 }, limit: 5 })
      const resAsc = await toArray(iterAsc)
      expect(resAsc).toEqual(notes.slice(0, 5))

      const iterDesc = await repo.list({ sort: { body: -1 }, limit: 5 })
      const resDesc = await toArray(iterDesc)
      expect(resDesc).toEqual(R.reverse(notes).slice(0, 5))
    })

    it('supports all args', async () => {
      const iter = await repo.list({ sort: { body: -1 }, offset: 5, limit: 2 })
      const res = await toArray(iter)
      expect(res).toEqual(R.reverse(notes).slice(5, 7))
    })
  })
}
