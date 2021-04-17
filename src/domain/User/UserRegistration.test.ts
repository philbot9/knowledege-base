import { mock } from 'jest-mock-extended'
import R from 'ramda'

import { Crypto } from '../util/Crypto'
import { IUserRepository } from './IUserRepository'
import { UserRegistration } from './UserRegistration'

describe('UserRegistration', () => {
  it('instantiates', () => {
    const userRepo = mock<IUserRepository>()
    const crypto = mock<Crypto>()
    const r = new UserRegistration({ userRepo, crypto })
    expect(r).toBeInstanceOf(UserRegistration)
  })

  describe('register', () => {
    const userRepo = mock<IUserRepository>()
    const crypto = mock<Crypto>()
    const r = new UserRegistration({ userRepo, crypto })

    const userData = {
      email: 'user@email.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'secretpass',
      passwordConfirmation: 'secretpass'
    }

    afterEach(() => jest.clearAllMocks())

    it('registers a user', async () => {
      crypto.hash.mockResolvedValueOnce('hashedpassword')
      userRepo.isEmailInUse.mockResolvedValueOnce(false)
      userRepo.create.mockImplementationOnce((_id, u) => Promise.resolve(u))

      const result = await r.register(userData)

      const user = result.success ? result.user : null
      expect(result.success).toBe(true)
      expect(user).toMatchObject(
        R.omit(['passwordConfirmation', 'password'], userData)
      )
      expect(user?.password).toEqual('hashedpassword')
      expect(crypto.hash).toHaveBeenCalledWith(userData.password)
      expect(userRepo.isEmailInUse).toHaveBeenCalledWith(userData.email)
      expect(userRepo.create.mock.calls[0][1]).toMatchObject({
        email: 'user@email.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedpassword'
      })
    })

    it('returns an error on invalid email', async () => {
      const result = await r.register({ ...userData, email: 'invalid!' })

      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const fe = formErrors![0]
      expect(fe.name).toBe('InvalidEmail')
      expect(fe.fieldName).toBe('email')
    })

    it('returns an error on invalid password', async () => {
      const result = await r.register({ ...userData, password: '' })
      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')

      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = formErrors![0]
      expect(e.name).toBe('PasswordTooShort')
      expect(e.fieldName).toBe('password')
    })

    it("returns an error if passwords dont't match", async () => {
      const result = await r.register({
        ...userData,
        password: 'abcdef',
        passwordConfirmation: 'defghi'
      })
      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')

      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = formErrors![0]
      expect(e.name).toBe('PasswordsDontMatch')
      expect(e.fieldName).toBe('passwordConfirmation')
    })

    it('returns an error on invalid firstName', async () => {
      const result = await r.register({ ...userData, firstName: '!_)#!' })
      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')

      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = formErrors![0]
      expect(e.name).toBe('InvalidCharacters')
      expect(e.fieldName).toBe('firstName')
    })

    it('returns an error on invalid firstName', async () => {
      const result = await r.register({ ...userData, lastName: '!_)#!' })
      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')

      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = formErrors![0]
      expect(e.name).toBe('InvalidCharacters')
      expect(e.fieldName).toBe('lastName')
    })

    it('returns an error if email is already in use', async () => {
      userRepo.isEmailInUse.mockResolvedValueOnce(true)
      const result = await r.register(userData)
      const formErrors = result.success ? null : result.formErrors
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(formErrors).toHaveLength(1)
      expect(error?.name).toBe('FormValidationFailed')

      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = formErrors![0]
      expect(e.name).toBe('EmailAlreadyInUse')
      expect(e.fieldName).toBe('email')
    })

    it('returns an error if creating user fails', async () => {
      userRepo.create.mockRejectedValue(new Error('some error'))
      const result = await r.register(userData)
      const error = result.success ? null : result.error

      expect(result.success).toBe(false)
      expect(error?.name).toBe('RegistrationFailed')
      expect(userRepo.create).toHaveBeenCalled()
    })

    it('returns multiple errors', async () => {
      // @ts-ignore
      const result = await r.register({})
      const formErrors = result.success ? null : result.formErrors
      expect(result.success).toBe(false)
      expect(formErrors?.length).toBeGreaterThan(1)
    })
  })
})
