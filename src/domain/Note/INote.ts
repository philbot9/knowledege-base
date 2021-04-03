import { ID } from '../util/id'

export type NoteFormat = 'text' | 'markdown' | 'html'

export interface INote {
  id: ID
  format: NoteFormat
  body: string
}
