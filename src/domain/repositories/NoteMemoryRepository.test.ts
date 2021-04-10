import { NoteMemoryRepository } from './NoteMemoryRepository'

import contract from './NoteRepositoryContract'

describe('NoteMemoryRepository', () => {
  const repo = new NoteMemoryRepository()
  contract(repo)
})
