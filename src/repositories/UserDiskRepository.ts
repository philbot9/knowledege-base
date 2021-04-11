import Datastore from 'nedb-promises'
import R from 'ramda'

import { User, UserSpec } from '../domain/User/User'
import { IUserRepository } from '../domain/User/IUserRepository'
import { NedbRepository } from '../nedb/NedbRepository'

export class UserDiskRepository
  extends NedbRepository<User>
  implements IUserRepository {
  constructor(db?: Datastore) {
    super('Entry', db)
  }

  async prepare(): Promise<void> {
    await this.db.ensureIndex({
      fieldName: 'id',
      unique: true
    })
  }

  protected buildRecord(data: object): User {
    const spec = R.omit(['_id'], data) as UserSpec
    return new User(spec)
  }
}
