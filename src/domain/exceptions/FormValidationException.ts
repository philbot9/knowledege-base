import { IException } from './IException'

export class FormValidationException extends Error implements IException {
  code: number = 400
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'FormValidationFailed'
  }
}
