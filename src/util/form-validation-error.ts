import { FormValidationException } from '../domain/exceptions/FormValidationException'
import { FormException } from '../domain/exceptions/FormException'
import { IException } from '../domain/exceptions/IException'

export type FieldErrors = {
  [fieldName: string]: { fieldName: string; message: string; name: string }
}

export type FormValidationError = {
  status: number
  message: string
  name: string
  fields: FieldErrors
}

export function buildFormValidationError(
  validationError: FormValidationException,
  formErrors: FormException[] = []
): FormValidationError {
  const formError: FormValidationError = {
    status: validationError.code,
    message: validationError.message,
    name: validationError.name,
    fields: {}
  }

  for (const err of formErrors) {
    formError.fields[err.fieldName] = {
      fieldName: err.fieldName,
      message: err.message,
      name: err.name
    }
  }

  return formError
}
