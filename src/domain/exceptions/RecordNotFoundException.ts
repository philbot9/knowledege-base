import { IException } from './IException'

export class RecordNotFoundException extends Error implements IException {
  code: number = 404
  name: string = 'RecordNotFound'

  constructor(message: string) {
    super(message)
  }
}
