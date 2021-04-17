import { User } from './User'

export interface IUserAuthentication {
  authenticate(creds: { email: string; password: string }): Promise<User>
}
