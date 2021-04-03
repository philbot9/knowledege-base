import { ID } from '../util/id'
import { INote } from './INote'

export interface INoteRepository {
  create(entry: INote): Promise<INote>
  read(id: ID): Promise<INote>
  update(id: ID, patch: object): Promise<INote>
  delete(id: ID): Promise<ID>
  listAll(): Promise<INote[]>
}