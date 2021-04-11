import Datastore from 'nedb-promises'
import path from 'path'
import fs from 'fs'

import { UserDiskRepository } from './UserDiskRepository'

import contract from './UserRepositoryContract'

describe('UserDiskRepository', () => {
  const filepath = path.join(__dirname, '../../test-data/User')

  afterAll(() => {
    fs.unlinkSync(filepath)
  })

  const db = new Datastore({
    filename: filepath,
    autoload: true
  })
  const repo = new UserDiskRepository(db)
  contract(repo)
})
