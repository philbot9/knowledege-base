import express, { Router } from 'express'
import { AuthenticationException } from '../domain/exceptions/AuthenticationException'
import { IUserAuthentication } from '../domain/User/IUserAuthentication'
import { viewGlobals } from '../util/view-globals'

export type SigninRouterArgs = {
  userAuthentication: IUserAuthentication
}

export function signinRouter(args: SigninRouterArgs): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    if (req.session?.userId) {
      return res.redirect('/')
    }
    next()
  })

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('signin', {
      title: viewGlobals.appName + ' - Login',
      values: {},
      error: null
    })
  })

  router.post('/', async (req, res) => {
    const payload = req.body

    let user
    try {
      user = await args.userAuthentication.authenticate({
        email: payload.email,
        password: payload.password
      })
    } catch (e) {
      const error =
        e instanceof AuthenticationException
          ? e.message
          : 'Authentication failed'

      return res.render('partials/login-form', {
        values: { email: payload.email },
        error
      })
    }

    if (!req.session) {
      console.error('No session for user')
      return res.status(500).end()
    }

    req.session.userId = user.id
    res.setHeader('HX-Redirect', '/')
    res.end()
  })

  return router
}
