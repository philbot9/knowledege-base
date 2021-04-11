import { ListArgs } from '../repository'
import { ID } from '../util/id'
import { Entry } from './Entry'

export interface IEntryRepository {
  create(id: ID, entry: Entry): Promise<Entry>
  read(id: ID): Promise<Entry>
  update(id: ID, patch: object): Promise<Entry>
  delete(id: ID): Promise<ID>
  list(args?: ListArgs): Promise<AsyncIterable<Entry>>
  listByUser(userId: ID, args?: ListArgs): Promise<AsyncIterable<Entry>>
}
