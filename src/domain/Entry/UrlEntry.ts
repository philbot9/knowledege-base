import { EntryType, IEntry } from './IEntry'
import { ID } from '../util/id'

export type UrlEntrySpec = {
  id: ID
  userId: ID
  title: string
  url: string
  noteId?: ID
  createdAt?: Date
  updatedAt?: Date
}

export class UrlEntry implements IEntry {
  readonly id: ID
  readonly userId: ID
  readonly type: EntryType
  readonly title: string
  readonly url: string
  readonly noteId?: ID
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(spec: UrlEntrySpec) {
    this.type = 'url'
    this.id = spec.id
    this.userId = spec.userId
    this.title = spec.title
    this.url = spec.url
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
      url: this.url,
      noteId: this.noteId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
