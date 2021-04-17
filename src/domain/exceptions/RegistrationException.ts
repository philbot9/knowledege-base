import { IException } from './IException'

export class RegistrationException extends Error implements IException {
  code: number = 500
  name: string = 'RegistrationFailed'

  constructor(message: string) {
    super(message)
  }
}
