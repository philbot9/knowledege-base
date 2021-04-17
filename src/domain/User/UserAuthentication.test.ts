import { mock } from 'jest-mock-extended'
import { IUserRepository } from './IUserRepository'
import { User } from './User'
import { Crypto } from '../util/Crypto'
import { UserAuthentication } from './UserAuthentication'
import { AuthenticationException } from '../exceptions/AuthenticationException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'

describe('UserAuthentication', () => {
  const userRepo = mock<IUserRepository>()
  const crypto = mock<Crypto>()
  const userAuthentication = new UserAuthentication({ userRepo, crypto })

  const user = new User({
    id: 'abc',
    email: 'test@user.com',
    password: 'hashed',
    firstName: 'Test',
    lastName: 'User'
  })

  describe('authenticate', () => {
    it('valid auth', async () => {
      userRepo.findByEmail.mockResolvedValueOnce(user)
      crypto.compare.mockResolvedValueOnce(true)

      await expect(
        userAuthentication.authenticate({
          email: 'test@user.com',
          password: 'plain'
        })
      ).resolves.toEqual(user)
      expect(userRepo.findByEmail).toHaveBeenCalledWith('test@user.com')
      expect(crypto.compare).toHaveBeenCalledWith('hashed', 'plain')
    })

    it('invalid email', async () => {
      userRepo.findByEmail.mockRejectedValueOnce(
        new RecordNotFoundException('No such user')
      )
      crypto.compare.mockResolvedValueOnce(true)

      expect.assertions(1)
      await userAuthentication
        .authenticate({ email: 'test@user.com', password: 'plain' })
        .catch((e: AuthenticationException) => {
          expect(e.name).toBe('AuthenticationFailed')
        })
    })

    it('incorrect password', async () => {
      userRepo.findByEmail.mockResolvedValueOnce(user)
      crypto.compare.mockResolvedValueOnce(false)

      expect.assertions(1)
      await userAuthentication
        .authenticate({ email: 'test@user.com', password: 'plain' })
        .catch((e: AuthenticationException) => {
          expect(e.name).toBe('AuthenticationFailed')
        })
    })
  })
})
