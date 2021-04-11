import { IEntity } from '../repository/IEntity'
import { ID } from '../util/id'

export type UserSpec = {
  id: ID
  email: string
  firstName: string
  lastName: string
  createdAt?: Date
  updatedAt?: Date
}

export class User implements IEntity {
  readonly id: ID
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(spec: UserSpec) {
    this.id = spec.id
    this.email = spec.email
    this.firstName = spec.firstName
    this.lastName = spec.lastName
    this.createdAt = spec.createdAt || new Date()
    this.updatedAt = spec.updatedAt || new Date()
  }

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}
