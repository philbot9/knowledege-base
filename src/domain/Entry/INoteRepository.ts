import { ListArgs } from '../repository'
import { ID } from '../util/id'
import { Note } from './Note'

export interface INoteRepository {
  create(id: ID, note: Note): Promise<Note>
  read(id: ID): Promise<Note>
  update(id: ID, patch: object): Promise<Note>
  delete(id: ID): Promise<ID>
  list(args?: ListArgs): Promise<AsyncIterable<Note>>
}
