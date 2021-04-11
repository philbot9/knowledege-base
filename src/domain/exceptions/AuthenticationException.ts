import { IException } from './IException'

export class AuthenticationException extends Error implements IException {
  code: number = 401
  name: string = 'AuthenticationFailed'

  constructor(message: string) {
    super(message)
  }
}
