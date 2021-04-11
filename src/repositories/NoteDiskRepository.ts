import Datastore from 'nedb-promises'
import R from 'ramda'

import { Note, NoteSpec } from '../domain/Entry/Note'
import { INoteRepository } from '../domain/Entry/INoteRepository'
import { NedbRepository } from '../nedb/NedbRepository'

export class NoteDiskRepository
  extends NedbRepository<Note>
  implements INoteRepository {
  constructor(db?: Datastore) {
    super('Entry', db)
  }

  async prepare(): Promise<void> {
    await this.db.ensureIndex({
      fieldName: 'id',
      unique: true
    })
  }

  protected buildRecord(data: object): Note {
    const spec = R.omit(['_id'], data) as NoteSpec
    return new Note(spec)
  }
}
