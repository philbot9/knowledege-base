import { IEntry } from '../Entry/IEntry'
import { IEntryRepository } from '../Entry/IEntryRepository'
import { NoteEntry } from '../Entry/NoteEntry'
import { IException } from '../exceptions/IException'
import { RecordAlreadyExistsException } from '../exceptions/RecordAlreadyExistsException'
import { generateId } from '../util/id'

export default function (repo: IEntryRepository) {
  describe('create', () => {
    const entry: IEntry = new NoteEntry({
      id: generateId(),
      title: 'Test',
      userId: generateId(),
      noteId: generateId()
    })

    it('creates a new entry', async () => {
      expect(repo.create(entry)).resolves.toEqual(entry)
      expect(repo.read(entry.id)).resolves.toEqual(entry)
      expect(repo.delete(entry.id)).resolves.toEqual(entry.id)
    })

    it('fails if id already in use', async () => {
      expect(repo.create(entry)).resolves.toEqual(entry)

      try {
        const result = await repo.create(entry)
        expect(result).toBeUndefined()
      } catch (e) {
        const exc = e as RecordAlreadyExistsException
        expect(exc.name).toBe('RecordAlreadyExists')
      } finally {
        repo.delete(entry.id)
      }
    })
  })
}
