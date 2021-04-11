import { ID } from '../util/id'

export interface IEntity {
  id: ID
  createdAt: Date
  updatedAt: Date

  toJson(): string
}
