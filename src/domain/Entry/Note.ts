import { ID } from '../util/id'
import { INote, NoteFormat } from './INote'

export type NoteSpec = {
  id: ID
  format: NoteFormat
  body: string
  createdAt?: Date
  updatedAt?: Date
}

export class Note implements INote {
  id: string
  format: NoteFormat
  body: string
  createdAt: Date
  updatedAt: Date

  constructor(spec: NoteSpec) {
    this.id = spec.id
    this.format = spec.format
    this.body = spec.body
    this.createdAt = spec.createdAt || new Date()
    this.updatedAt = spec.updatedAt || new Date()
  }

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      format: this.format,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
