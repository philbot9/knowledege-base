import { ListArgs } from '../repositories'
import { ID } from '../util/id'
import { Note } from './Note'

export interface INoteRepository {
  create(entry: Note): Promise<Note>
  read(id: ID): Promise<Note>
  update(id: ID, patch: object): Promise<Note>
  delete(id: ID): Promise<ID>
  list(args?: ListArgs): Promise<AsyncIterable<Note>>
}
