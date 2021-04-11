import { Entry } from '../Entry/Entry'
import { IEntryRepository } from '../Entry/IEntryRepository'
import { RecordAlreadyExistsException } from '../exceptions/RecordAlreadyExistsException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ID } from '../util/id'
import * as asyncIterator from '../../util/async-iterator'
import { ListArgs, SortSpec } from '.'

export class EntryMemoryRepository implements IEntryRepository {
  data: Map<ID, Entry> = new Map()

  async create(entry: Entry): Promise<Entry> {
    if (this.data.has(entry.id)) {
      throw new RecordAlreadyExistsException(
        'Entry with id already exists: ' + entry.id
      )
    }
    this.data.set(entry.id, entry)

    return entry
  }

  async read(id: string): Promise<Entry> {
    this.existsGuard(id)
    return this.data.get(id)!
  }

  async update(id: string, patch: object): Promise<Entry> {
    this.existsGuard(id)

    const entry = this.data.get(id)!
    const merged = Object.assign({}, entry, { ...patch, id })
    this.data.set(id, merged)

    return merged
  }

  async delete(id: ID): Promise<ID> {
    this.existsGuard(id)
    this.data.delete(id)
    return id
  }

  async list(args?: ListArgs): Promise<AsyncIterable<Entry>> {
    const offset = args?.offset
    const limit = args?.limit
    const sort = args?.sort

    let entries: Entry[] = []
    for (const e of this.data.values()) {
      entries.push(e)
    }

    if (sort) {
      entries = this.sort(entries, sort)
    }

    entries = this.applyLimits(entries, limit, offset)

    return asyncIterator.fromArray(entries)
  }

  async listByUser(
    userId: ID,
    args: ListArgs = {}
  ): Promise<AsyncIterable<Entry>> {
    const offset = args?.offset
    const limit = args?.limit
    const sort = args?.sort

    let entries: Entry[] = []
    for (const e of this.data.values()) {
      if (e.userId === userId) {
        entries.push(e)
      }
    }

    if (sort) {
      entries = this.sort(entries, sort)
    }

    entries = this.applyLimits(entries, limit, offset)

    return asyncIterator.fromArray(entries)
  }

  private existsGuard(id: ID) {
    if (!this.data.has(id)) {
      throw new RecordNotFoundException('No Entry with id: ' + id)
    }
  }

  // Naive sort algo, but it'll do for testing
  private sort(entries: Entry[], spec: SortSpec) {
    return entries.sort((a: Entry, b: Entry) => {
      for (const key in spec) {
        // @ts-ignore
        if (a[key] === b[key]) {
          continue
        }

        if (spec[key] > 0) {
          // Ascending
          // @ts-ignore
          return a[key] > b[key] ? 1 : -1
        } else {
          // Descending
          // @ts-ignore
          return a[key] < b[key] ? 1 : -1
        }
      }
      return 0
    })
  }

  private applyLimits(
    entries: Entry[],
    limit?: number,
    offset?: number
  ): Entry[] {
    if (offset && limit) {
      return entries.slice(offset, offset + limit)
    } else if (offset) {
      return entries.slice(offset)
    } else if (limit) {
      return entries.slice(0, limit)
    }

    return entries
  }
}
