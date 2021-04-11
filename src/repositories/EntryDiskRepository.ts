import Datastore from 'nedb-promises'
import R from 'ramda'

import { Entry, EntrySpec } from '../domain/Entry/Entry'
import { IEntryRepository } from '../domain/Entry/IEntryRepository'
import { ID } from '../domain/util/id'
import * as asyncIterator from '../util/async-iterator'
import { ListArgs } from '../domain/repository'
import { NoteEntry, NoteEntrySpec } from '../domain/Entry/NoteEntry'
import { UrlEntry, UrlEntrySpec } from '../domain/Entry/UrlEntry'
import { NedbRepository } from '../nedb/NedbRepository'

export class EntryDiskRepository
  extends NedbRepository<Entry>
  implements IEntryRepository {
  constructor(db?: Datastore) {
    super('Entry', db)
  }

  async prepare(): Promise<void> {
    await this.db.ensureIndex({
      fieldName: 'id',
      unique: true
    })

    await this.db.ensureIndex({
      fieldName: 'userId',
      unique: false
    })
  }
  protected buildRecord(data: object): Entry {
    const entrySpec = R.omit(['_id'], data) as EntrySpec

    if (entrySpec.type === 'note') {
      // @ts-ignore
      const spec = entrySpec as NoteEntrySpec
      return new NoteEntry(spec)
    } else if (entrySpec.type === 'url') {
      // @ts-ignore
      const spec = entrySpec as UrlEntrySpec
      return new UrlEntry(spec)
    }

    throw new Error('Invalid entry type ' + entrySpec.type)
  }

  async listByUser(
    userId: ID,
    args: ListArgs = {}
  ): Promise<AsyncIterable<Entry>> {
    const sort = args?.sort
    const offset = args?.offset
    const limit = args?.limit

    const cursor = this.db.find({ userId })

    if (sort) {
      cursor.sort(sort)
    }

    if (offset) {
      cursor.skip(offset)
    }

    if (limit) {
      cursor.limit(limit)
    }

    const results = await cursor.exec()
    const entries = results.map(r => this.buildRecord(r))

    return asyncIterator.fromArray(entries)
  }
}
