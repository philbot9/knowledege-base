import Datastore from 'nedb-promises'
import path from 'path'
import fs from 'fs'

import { EntryDiskRepository } from './EntryDiskRepository'

import contract from './EntryRepositoryContract'

describe('EntryDiskRepository', () => {
  const filepath = path.join(__dirname, '../../test-data/Entry')

  beforeAll(() => {
    fs.existsSync(filepath) && fs.unlinkSync(filepath)
  })

  afterAll(() => {
    fs.unlinkSync(filepath)
  })

  const db = new Datastore({
    filename: filepath,
    autoload: true
  })
  const repo = new EntryDiskRepository(db)
  contract(repo)

  it('can be prepared', async () => {
    await repo.prepare()
  })
})
