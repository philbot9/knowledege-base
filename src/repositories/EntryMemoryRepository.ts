import Datastore from 'nedb-promises'
import { IEntryRepository } from '../domain/Entry/IEntryRepository'
import { EntryDiskRepository } from './EntryDiskRepository'

export class EntryMemoryRepository
  extends EntryDiskRepository
  implements IEntryRepository {
  constructor() {
    super(
      new Datastore({
        inMemoryOnly: true
      })
    )
  }
}
