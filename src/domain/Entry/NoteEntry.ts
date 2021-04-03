import { EntryType, IEntry } from './IEntry'
import { ID } from '../util/id'

export type NoteEntrySpec = {
  id: ID
  userId: ID
  title: string
  noteId: ID
}

export class NoteEntry implements IEntry {
  id: ID
  userId: ID
  type: EntryType
  title: string
  noteId: ID

  constructor(spec: NoteEntrySpec) {
    this.type = 'note'

    this.id = spec.id
    this.userId = spec.userId
    this.title = spec.title
    this.noteId = spec.noteId
  }

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      noteId: this.noteId
    })
  }
}
