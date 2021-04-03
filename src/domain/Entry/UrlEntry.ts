import { EntryType, IEntry } from './IEntry'
import { INote } from '../Note/INote'
import { ID } from '../util/id'

export type UrlEntrySpec = {
  id: ID
  userId: ID
  title: string
  url: string
  noteId?: ID
}

export class UrlEntry implements IEntry {
  id: ID
  userId: ID
  type: EntryType
  title: string
  url: string
  noteId?: ID

  constructor(spec: UrlEntrySpec) {
    this.type = 'url'

    this.id = spec.id
    this.userId = spec.userId
    this.title = spec.title
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
      noteId: this.noteId
    })
  }
}
