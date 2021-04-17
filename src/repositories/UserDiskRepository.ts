import Datastore from 'nedb-promises'
import R from 'ramda'

import { User, UserSpec } from '../domain/User/User'
import { IUserRepository } from '../domain/User/IUserRepository'
import { NedbRepository } from '../nedb/NedbRepository'
import { RecordNotFoundException } from '../domain/exceptions/RecordNotFoundException'

export class UserDiskRepository
  extends NedbRepository<User>
  implements IUserRepository {
  constructor(db?: Datastore) {
    super('User', db)
  }

  async prepare(): Promise<void> {
    await this.db.ensureIndex({
      fieldName: 'id',
      unique: true
    })
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.db.findOne({ email })
    if (!user) {
      throw new RecordNotFoundException('No such user')
    }
    return this.buildRecord(user)
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const count = await this.db.count({ email })
    return count > 0
  }

  protected buildRecord(data: object): User {
    const spec = R.omit(['_id'], data) as UserSpec
    return new User(spec)
  }
}
