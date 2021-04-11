import { ListArgs } from '../repository'
import { ID } from '../util/id'
import { User } from './User'

export interface IUserRepository {
  create(id: ID, entry: User): Promise<User>
  read(id: ID): Promise<User>
  findByEmail(email: string): Promise<User>
  update(id: ID, patch: object): Promise<User>
  delete(id: ID): Promise<ID>
  list(args?: ListArgs): Promise<AsyncIterable<User>>
}
