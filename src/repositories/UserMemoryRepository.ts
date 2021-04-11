import Datastore from 'nedb-promises'
import { IUserRepository } from '../domain/User/IUserRepository'
import { UserDiskRepository } from './UserDiskRepository'

export class UserMemoryRepository
  extends UserDiskRepository
  implements IUserRepository {
  constructor() {
    super(
      new Datastore({
        inMemoryOnly: true
      })
    )
  }
}
