import { IEntity } from '../repositories/IEntity'
import { ID } from '../util/id'

export type EntryType = 'url' | 'note'

export interface IEntry extends IEntity {
  userId: ID
  type: EntryType
  title: string
}
