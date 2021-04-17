import express, { Router } from 'express'
import R from 'ramda'

import { IUserRegistration } from '../domain/User/IUserRegistration'
import { buildFormValidationError } from '../util/form-validation-error'
import { viewGlobals } from '../util/view-globals'

export type SignupRouterArgs = {
  userRegistration: IUserRegistration
}

export function signupRouter(args: SignupRouterArgs): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    if (req.session?.userId) {
      return res.redirect('/')
    }
    next()
  })

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('signup', {
      title: viewGlobals.appName + ' - Registration',
      values: {},
      error: null,
      fieldErrors: {}
    })
  })

  router.post('/', async (req, res) => {
    const userData = req.body
    const result = await args.userRegistration.register(userData)

    if (!result.success) {
      const validationError = buildFormValidationError(
        result.error,
        result.formErrors
      )

      res.render('partials/registration-form', {
        values: R.omit(['password', 'passwordConfirmation'], userData),
        error: validationError.message,
        fieldErrors: validationError.fields
      })
    } else {
      if (!req.session) {
        console.error('No session for registered user')
        return res.status(500).end()
      }

      req.session.userId = result.user.id
      res.setHeader('HX-Redirect', '/')
    }
  })

  return router
}
