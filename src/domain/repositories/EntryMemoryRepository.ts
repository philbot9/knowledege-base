import { IEntry } from '../Entry/IEntry'
import { IEntryRepository } from '../Entry/IEntryRepository'
import { RecordAlreadyExistsException } from '../exceptions/RecordAlreadyExistsException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ID } from '../util/id'
import * as asyncIterator from '../util/async-iterator'

export class EntryMemoryRepository implements IEntryRepository {
  data: Map<ID, IEntry> = new Map()

  async create(entry: IEntry): Promise<IEntry> {
    if (this.data.has(entry.id)) {
      throw new RecordAlreadyExistsException(
        'Entry with id already exists: ' + entry.id
      )
    }
    this.data.set(entry.id, entry)

    return entry
  }

  async read(id: string): Promise<IEntry> {
    this.existsGuard(id)
    return this.data.get(id)!
  }

  async update(id: string, patch: object): Promise<IEntry> {
    this.existsGuard(id)

    const entry = this.data.get(id)!
    const merged = Object.assign({}, entry, patch)
    this.data.set(id, merged)

    return merged
  }

  async delete(id: ID): Promise<ID> {
    this.existsGuard(id)
    this.data.delete(id)
    return id
  }

  async listAll(): Promise<AsyncIterable<IEntry>> {
    return asyncIterator.fromIterable(this.data.values())
  }

  async listByUser(userId: string): Promise<AsyncIterable<IEntry>> {
    const entries = []

    for (const item of this.data.values()) {
      if (item.userId === userId) {
        entries.push(item)
      }
    }

    return asyncIterator.fromArray(entries)
  }

  private existsGuard(id: ID) {
    if (!this.data.has(id)) {
      throw new RecordNotFoundException('No Entry with id: ' + id)
    }
  }
}
