import { NedbRepository } from './NedbRepository'
import fs from 'fs'
import Datastore from 'nedb-promises'

class TestRepository extends NedbRepository<object> {
  prepare(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  protected buildRecord(data: object): object {
    throw new Error('Method not implemented.')
  }
}

describe('NedbRepository', () => {
  it('supports default backend', () => {
    const repo = new TestRepository('NedbTest')
    expect(repo.db).toBeInstanceOf(Datastore)
    expect(repo.filepath).toContain('NedbTest')
    try {
      fs.unlinkSync(repo.filepath)
    } catch (e) {}
  })

  it('supports custom backend', () => {
    const db = new Datastore({ inMemoryOnly: true })
    const repo = new TestRepository('NedbTest', db)
    expect(repo.db).toEqual(db)
  })
})
