import { AuthenticationException } from '../exceptions/AuthenticationException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { Crypto } from '../util/Crypto'
import { IUserRepository } from './IUserRepository'
import { User } from './User'

const DUMMY_PASSWORD = 'dummy password'
const DUMMY_HASH =
  '$2b$10$A4ggNCDfzfdOsar93smN6u4H/788pWH25LVIETqWQVESPXwswnJvW'

export type UserAuthSpec = {
  userRepo: IUserRepository
  crypto: Crypto
}

export class UserAuth {
  userRepo: IUserRepository
  crypto: Crypto

  constructor(spec: UserAuthSpec) {
    this.userRepo = spec.userRepo
    this.crypto = spec.crypto
  }

  async authenticate(creds: {
    email: string
    password: string
  }): Promise<User> {
    let user

    try {
      user = await this.userRepo.findByEmail(creds.email)
      if (!user) throw new RecordNotFoundException('No such user')
    } catch (e) {
      // pretend we do a comparison to prevent timing attacks
      await this.crypto.compare(DUMMY_HASH, DUMMY_PASSWORD)
      throw new AuthenticationException('Invalid email of password')
    }

    const validPw = await this.crypto.compare(user.password, creds.password)
    if (!validPw) {
      throw new AuthenticationException('Invalid email of password')
    }

    return user
  }
}
