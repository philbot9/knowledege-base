import { generateId } from '../util/id'
import { UrlEntry } from './UrlEntry'

describe('Note', () => {
  it('instantiates', async () => {
    const entry = new UrlEntry({
      id: generateId(),
      noteId: generateId(),
      userId: generateId(),
      title: 'Test',
      url: 'http://test.com'
    })

    expect(typeof entry.id).toBe('string')
    expect(entry.id.length).toBeGreaterThan(1)
    expect(typeof entry.noteId).toBe('string')
    expect(entry.noteId?.length).toBeGreaterThan(1)
    expect(typeof entry.userId).toBe('string')
    expect(entry.userId.length).toBeGreaterThan(1)
    expect(entry.title).toBe('Test')
    expect(entry.url).toBe('http://test.com')
    expect(entry.createdAt).toBeInstanceOf(Date)
    expect(entry.updatedAt).toBeInstanceOf(Date)
  })

  it('toJson()', () => {
    const entry = new UrlEntry({
      id: generateId(),
      noteId: generateId(),
      userId: generateId(),
      title: 'Test',
      url: 'http://test.com'
    })

    expect(JSON.parse(entry.toJson())).toMatchObject({
      id: entry.id,
      noteId: entry.noteId,
      userId: entry.userId,
      title: entry.title,
      url: entry.url,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    })
  })
})
