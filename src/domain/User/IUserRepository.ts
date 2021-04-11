import { ListArgs } from '../repositories'
import { ID } from '../util/id'
import { User } from './User'

export interface IUserRepository {
  create(entry: User): Promise<User>
  read(id: ID): Promise<User>
  update(id: ID, patch: object): Promise<User>
  delete(id: ID): Promise<ID>
  list(args?: ListArgs): Promise<AsyncIterable<User>>
}
