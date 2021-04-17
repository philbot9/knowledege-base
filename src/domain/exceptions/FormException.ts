import { IException } from './IException'

export class FormException extends Error implements IException {
  code: number = 400
  name: string
  fieldName: string

  constructor(spec: { message: string; name: string; fieldName: string }) {
    super(spec.message)
    this.name = spec.name
    this.fieldName = spec.fieldName
  }
}
