import express, { Router } from 'express'
import { AuthenticationException } from '../domain/exceptions/AuthenticationException'
import { IUserAuthentication } from '../domain/User/IUserAuthentication'
import { viewGlobals } from '../util/view-globals'

export type SignoutRouterArgs = {}

export function signoutRouter(_args: SignoutRouterArgs): Router {
  const router = express.Router()

  router.get('/', function (req, res) {
    req.session = null
    res.clearCookie('session')
    res.redirect('/signin')
  })

  return router
}
