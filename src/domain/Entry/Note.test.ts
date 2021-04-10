import { generateId } from '../util/id'
import { Note } from './Note'

describe('Note', () => {
  it('instantiate', async () => {
    const note = new Note({
      id: generateId(),
      body: 'Body 1',
      format: 'markdown'
    })

    expect(typeof note.id).toBe('string')
    expect(note.id.length).toBeGreaterThan(1)
    expect(note.body).toBe('Body 1')
    expect(note.format).toBe('markdown')
    expect(note.createdAt).toBeInstanceOf(Date)
    expect(note.updatedAt).toBeInstanceOf(Date)
  })

  it('toJson()', () => {
    const note = new Note({
      id: generateId(),
      body: 'Body 1',
      format: 'markdown'
    })

    expect(JSON.parse(note.toJson())).toMatchObject({
      id: note.id,
      body: note.body,
      format: note.format,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString()
    })
  })
})
