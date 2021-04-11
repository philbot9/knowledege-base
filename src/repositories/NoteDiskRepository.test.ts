import Datastore from 'nedb-promises'
import path from 'path'
import fs from 'fs'

import { NoteDiskRepository } from './NoteDiskRepository'

import contract from './NoteRepositoryContract'

describe('NoteDiskRepository', () => {
  const filepath = path.join(__dirname, '../../test-data/Note')

  afterAll(() => {
    fs.unlinkSync(filepath)
  })

  const db = new Datastore({
    filename: filepath,
    autoload: true
  })
  const repo = new NoteDiskRepository(db)
  contract(repo)
})
