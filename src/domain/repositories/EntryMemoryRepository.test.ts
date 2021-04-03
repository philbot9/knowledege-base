import { EntryMemoryRepository } from './EntryMemoryRepository'

import contract from './EntryRepositoryContract'

describe('EntryMemoryRepository', () => {
  const repo = new EntryMemoryRepository()
  contract(repo)
})
