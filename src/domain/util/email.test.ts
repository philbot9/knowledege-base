import e from 'express'
import { isEmailValid } from './email'

describe('isEmailValid', () => {
  it('valid email', () => {
    expect(isEmailValid('valid@email.com')).toBe(true)
    expect(isEmailValid('test@email.ca')).toBe(true)
  })

  it('invalid email', () => {
    expect(isEmailValid('invalid')).toBe(false)
    expect(isEmailValid('invalid@email')).toBe(false)
    expect(isEmailValid('invalid@email.')).toBe(false)
  })
})
