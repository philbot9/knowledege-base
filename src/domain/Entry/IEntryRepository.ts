import { ID } from '../util/id'
import { IEntry } from './IEntry'

export interface IEntryRepository {
  create(entry: IEntry): Promise<IEntry>
  read(id: ID): Promise<IEntry>
  update(id: ID, patch: object): Promise<IEntry>
  delete(id: ID): Promise<ID>
  listAll(): Promise<AsyncIterable<IEntry>>
  listByUser(userId: ID): Promise<AsyncIterable<IEntry>>
}
