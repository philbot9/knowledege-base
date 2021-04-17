import { FormException } from '../exceptions/FormException'
import { IException } from '../exceptions/IException'
import { User } from './User'

export type UserRegistrationData = {
  email: string
  password: string
  passwordConfirmation: string
  firstName: string
  lastName: string
}

export type UserRegistrationSuccess = {
  success: true
  user: User
}
export type UserRegistrationFailure = {
  success: false
  error: IException
  formErrors?: FormException[]
}
export type UserRegistrationResult =
  | UserRegistrationSuccess
  | UserRegistrationFailure

export interface IUserRegistration {
  register(data: UserRegistrationData): Promise<UserRegistrationResult>
}
