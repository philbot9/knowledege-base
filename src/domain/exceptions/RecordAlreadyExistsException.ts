import { IException } from './IException'

export class RecordAlreadyExistsException extends Error implements IException {
  code: number = 401
  name: string = 'RecordAlreadyExists'

  constructor(message: string) {
    super(message)
  }
}
