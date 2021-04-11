import { Entry, EntrySpec, EntryType } from './Entry'
import { ID } from '../util/id'

export type NoteEntrySpec = {
  id: ID
  userId: ID
  noteId: ID
  title: string
  createdAt?: Date
  updatedAt?: Date
}

export class NoteEntry extends Entry {
  readonly noteId: ID

  constructor(spec: NoteEntrySpec) {
    super({ ...spec, type: 'note' })
    this.noteId = spec.noteId
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
