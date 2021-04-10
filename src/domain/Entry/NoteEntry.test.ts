import { generateId } from '../util/id'
import { NoteEntry } from './NoteEntry'

describe('Note', () => {
  it('instantiate', async () => {
    const entry = new NoteEntry({
      id: generateId(),
      noteId: generateId(),
      userId: generateId(),
      title: 'Test'
    })

    expect(typeof entry.id).toBe('string')
    expect(entry.id.length).toBeGreaterThan(1)
    expect(typeof entry.noteId).toBe('string')
    expect(entry.noteId.length).toBeGreaterThan(1)
    expect(typeof entry.userId).toBe('string')
    expect(entry.userId.length).toBeGreaterThan(1)
    expect(entry.title).toBe('Test')
    expect(entry.createdAt).toBeInstanceOf(Date)
    expect(entry.updatedAt).toBeInstanceOf(Date)
  })

  it('toJson()', () => {
    const entry = new NoteEntry({
      id: generateId(),
      noteId: generateId(),
      userId: generateId(),
      title: 'Test'
    })

    expect(JSON.parse(entry.toJson())).toMatchObject({
      id: entry.id,
      noteId: entry.noteId,
      userId: entry.userId,
      title: entry.title,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    })
  })
})
