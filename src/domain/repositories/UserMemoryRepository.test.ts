import { UserMemoryRepository } from './UserMemoryRepository'

import contract from './UserRepositoryContract'

describe('UserMemoryRepository', () => {
  const repo = new UserMemoryRepository()
  contract(repo)
})
