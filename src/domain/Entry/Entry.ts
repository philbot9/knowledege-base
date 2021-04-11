import { IEntity } from '../repository/IEntity'
import { ID } from '../util/id'

export type EntryType = 'url' | 'note'

export type EntrySpec = {
  id: string
  userId: ID
  type: EntryType
  title: string
  createdAt?: Date
  updatedAt?: Date
}

export abstract class Entry implements IEntity {
  readonly id: string
  readonly userId: ID
  readonly type: EntryType
  readonly title: string
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(spec: EntrySpec) {
    this.id = spec.id
    this.userId = spec.userId
    this.type = spec.type
    this.title = spec.title
    this.createdAt = spec.createdAt || new Date()
    this.updatedAt = spec.updatedAt || new Date()
  }

  abstract toJson(): string
}
