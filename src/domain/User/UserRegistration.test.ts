import { mock } from 'jest-mock-extended'
import R from 'ramda'

import { FormException } from '../exceptions/FormException'
import { RegistrationException } from '../exceptions/RegistrationException'
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

      expect(result.errors).toBeUndefined()
      expect(result.user).toMatchObject(
        R.omit(['passwordConfirmation', 'password'], userData)
      )
      expect(result.user?.password).toEqual('hashedpassword')
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
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('InvalidEmail')
      expect(e.fieldName).toBe('email')
    })

    it('returns an error on invalid password', async () => {
      const result = await r.register({ ...userData, password: '' })
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('PasswordTooShort')
      expect(e.fieldName).toBe('password')
    })

    it("returns an error if passwords dont't match", async () => {
      const result = await r.register({
        ...userData,
        password: 'abcdef',
        passwordConfirmation: 'defghi'
      })
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('PasswordsDontMatch')
      expect(e.fieldName).toBe('passwordConfirmation')
    })

    it('returns an error on invalid firstName', async () => {
      const result = await r.register({ ...userData, firstName: '!_)#!' })
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('InvalidCharacters')
      expect(e.fieldName).toBe('firstName')
    })

    it('returns an error on invalid firstName', async () => {
      const result = await r.register({ ...userData, lastName: '!_)#!' })
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('InvalidCharacters')
      expect(e.fieldName).toBe('lastName')
    })

    it('returns an error if email is already in use', async () => {
      userRepo.isEmailInUse.mockResolvedValueOnce(true)
      const result = await r.register(userData)
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as FormException
      expect(e.name).toBe('EmailAlreadyInUse')
      expect(e.fieldName).toBe('email')
    })

    it('returns an error if creating user fails', async () => {
      userRepo.create.mockRejectedValue(new Error('some error'))
      const result = await r.register(userData)
      expect(result.errors).toHaveLength(1)
      expect(userRepo.create).not.toHaveBeenCalledWith()

      const e = result.errors![0] as RegistrationException
      expect(e.name).toBe('RegistrationFailed')
    })

    it('returns multiple errors', async () => {
      // @ts-ignore
      const result = await r.register({})
      expect(result.errors?.length).toBeGreaterThan(1)
    })
  })
})
