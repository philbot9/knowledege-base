import Datastore from 'nedb-promises'
import path from 'path'

import { RecordAlreadyExistsException } from '../domain/exceptions/RecordAlreadyExistsException'
import { RecordNotFoundException } from '../domain/exceptions/RecordNotFoundException'
import { ID } from '../domain/util/id'
import * as asyncIterator from '../util/async-iterator'
import { ListArgs } from '../domain/repository'

export abstract class NedbRepository<T> {
  db: Datastore
  name: string
  filepath: string

  constructor(name: string, db?: Datastore) {
    this.name = name

    if (db) {
      this.filepath = ''
      this.db = db
    } else {
      this.filepath = path.join(__dirname, '../../data/', name)
      this.db = Datastore.create(this.filepath)
    }
  }

  abstract prepare(): Promise<void>
  protected abstract buildRecord(data: object): T

  async create(id: ID, doc: T): Promise<T> {
    const count = await this.db.count({ id })
    if (count > 0) {
      throw new RecordAlreadyExistsException(
        'Record with id already exists: ' + id
      )
    }

    await this.db.insert({ id, ...doc })
    return doc
  }

  async read(id: ID): Promise<T> {
    const res = await this.db.findOne({ id })
    if (!res) {
      throw new RecordNotFoundException('Could not find entry with ID ' + id)
    }
    return this.buildRecord(res)
  }

  async update(id: string, patch: object): Promise<T> {
    const updated = await this.db.update(
      { id },
      { $set: patch },
      { multi: false, returnUpdatedDocs: true }
    )

    if (!updated) {
      throw new RecordNotFoundException('Could not find record with ID ' + id)
    }

    return this.buildRecord(updated)
  }

  async delete(id: ID): Promise<ID> {
    const numDeleted = await this.db.remove({ id }, { multi: false })
    if (numDeleted !== 1) {
      throw new RecordNotFoundException('Could not find record with ID ' + id)
    }
    return id
  }

  async list(args?: ListArgs): Promise<AsyncIterable<T>> {
    const sort = args?.sort
    const offset = args?.offset
    const limit = args?.limit

    const cursor = this.db.find({})

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
