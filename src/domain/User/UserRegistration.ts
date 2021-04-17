import { generateId, ID } from '../util/id'
import { IUserRepository } from './IUserRepository'
import { FormException } from '../exceptions/FormException'
import { RegistrationException } from '../exceptions/RegistrationException'
import { User } from './User'
import { Crypto } from '../util/Crypto'
import {
  IUserRegistration,
  UserRegistrationData,
  UserRegistrationResult
} from './IUserRegistration'
import { isEmailValid } from '../util/email'
import { FormValidationException } from '../exceptions/FormValidationException'

export type UserRegistrationSpec = {
  userRepo: IUserRepository
  crypto: Crypto
}

export class UserRegistration implements IUserRegistration {
  userRepo: IUserRepository
  crypto: Crypto

  constructor(spec: UserRegistrationSpec) {
    this.userRepo = spec.userRepo
    this.crypto = spec.crypto
  }

  async register(data: UserRegistrationData): Promise<UserRegistrationResult> {
    const formErrors = this.runValidations(
      () => this.validateEmail(data.email),
      () => this.validatePassword(data.password, data.passwordConfirmation),
      () =>
        this.validateName(
          { minLength: 1, maxLength: 64, fieldName: 'firstName' },
          data.firstName
        ),
      () =>
        this.validateName(
          { minLength: 1, maxLength: 64, fieldName: 'lastName' },
          data.lastName
        )
    )

    if (formErrors.length) {
      return {
        success: false,
        error: new FormValidationException('Registration failed'),
        formErrors
      }
    }

    const emailIsInUse = await this.userRepo.isEmailInUse(data.email)
    if (emailIsInUse) {
      return {
        success: false,
        error: new FormValidationException('Registration failed'),
        formErrors: [
          new FormException({
            name: 'EmailAlreadyInUse',
            message: 'Email already in use',
            fieldName: 'email'
          })
        ]
      }
    }

    const hashedPassword = await this.crypto.hash(data.password)

    const user = new User({
      id: generateId(),
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName
    })

    try {
      await this.userRepo.create(user.id, user)
    } catch (e) {
      return {
        success: false,
        error: new RegistrationException(
          'Registration failed due to an internal error'
        )
      }
    }

    return { success: true, user }
  }

  private runValidations(...validations: Function[]): FormException[] {
    let errors = []
    for (const validation of validations) {
      try {
        validation()
      } catch (e) {
        errors.push(e)
      }
    }

    return errors
  }

  private validateEmail(email: string): boolean {
    if (!isEmailValid(email)) {
      throw new FormException({
        name: 'InvalidEmail',
        message: 'Invalid email format',
        fieldName: 'email'
      })
    }

    return true
  }

  private validatePassword(password: string, confirmation: string): boolean {
    if (password.length <= 3) {
      throw new FormException({
        name: 'PasswordTooShort',
        message: 'Password is too short',
        fieldName: 'password'
      })
    }

    if (password.length > 64) {
      throw new FormException({
        name: 'PasswordTooLong',
        message: 'Password is too long',
        fieldName: 'password'
      })
    }

    if (password !== confirmation) {
      throw new FormException({
        name: 'PasswordsDontMatch',
        message: 'Passwords do not match',
        fieldName: 'passwordConfirmation'
      })
    }

    return true
  }

  private validateName(
    spec: { minLength: number; maxLength: number; fieldName: string },
    val: string
  ): boolean {
    if (val.length < spec.minLength) {
      throw new FormException({
        name: 'ValueTooShort',
        message: 'Value is too short',
        fieldName: spec.fieldName
      })
    }

    if (val.length > spec.maxLength) {
      throw new FormException({
        name: 'ValueTooLong',
        message: 'Value is too long',
        fieldName: spec.fieldName
      })
    }

    if (!/^[\w\d.\s-]+$/.test(val)) {
      throw new FormException({
        name: 'InvalidCharacters',
        message: 'Value contains invalid characters',
        fieldName: spec.fieldName
      })
    }

    return true
  }
}
