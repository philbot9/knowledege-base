import { ID } from '../util/id'

export type EntryType = 'url' | 'note'

export interface IEntry {
  id: ID
  userId: ID
  type: EntryType
  title: string

  toJson(): string
}
