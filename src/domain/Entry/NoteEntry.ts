import { EntryType, IEntry } from './IEntry'
import { ID } from '../util/id'

export type NoteEntrySpec = {
  id: ID
  userId: ID
  title: string
  noteId: ID
  createdAt?: Date
  updatedAt?: Date
}

export class NoteEntry implements IEntry {
  readonly id: ID
  readonly userId: ID
  readonly type: EntryType
  readonly title: string
  readonly noteId: ID
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(spec: NoteEntrySpec) {
    this.type = 'note'

    this.id = spec.id
    this.userId = spec.userId
    this.title = spec.title
    this.noteId = spec.noteId
    this.createdAt = spec.createdAt || new Date()
    this.updatedAt = spec.updatedAt || new Date()
  }

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      noteId: this.noteId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
