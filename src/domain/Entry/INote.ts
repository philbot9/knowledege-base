import { IEntity } from '../repositories/IEntity'
import { ID } from '../util/id'

export type NoteFormat = 'text' | 'markdown' | 'html'

export interface INote extends IEntity {
  id: ID
  format: NoteFormat
  body: string
}
