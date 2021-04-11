import Datastore from 'nedb-promises'
import { INoteRepository } from '../domain/Entry/INoteRepository'
import { NoteDiskRepository } from './NoteDiskRepository'

export class NoteMemoryRepository
  extends NoteDiskRepository
  implements INoteRepository {
  constructor() {
    super(
      new Datastore({
        inMemoryOnly: true
      })
    )
  }
}
