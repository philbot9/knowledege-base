import express, { Router } from 'express'
import { UserAuth } from '../domain/User/UserAuth'

export type SigninRouterArgs = {
  // userAuth: UserAuth
}

export function signinRouter(args: SigninRouterArgs): Router {
  const router = express.Router()

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('signin', { title: 'Owby', user: null })
  })

  return router
}
