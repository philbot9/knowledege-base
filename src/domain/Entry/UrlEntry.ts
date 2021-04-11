import { Entry } from './Entry'
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

export class UrlEntry extends Entry {
  readonly url: string
  readonly noteId?: ID

  constructor(spec: UrlEntrySpec) {
    super({ ...spec, type: 'url' })
    this.url = spec.url
    this.noteId = spec.noteId
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
