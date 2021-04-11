import bcrypt from 'bcrypt'

export class Crypto {
  async hash(val: string): Promise<string> {
    return bcrypt.hash(val, 10)
  }

  async compare(hashed: string, plain: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }
}
