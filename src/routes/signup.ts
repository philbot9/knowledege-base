import express, { Router } from 'express'
import { UserRegistration } from '../domain/User/UserRegistration'

export type SignupRouterArgs = {
  userRegistration: UserRegistration
}

export function signupRouter(args: SignupRouterArgs): Router {
  const router = express.Router()

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('signup', { title: 'Owby', user: null })
  })

  router.post('/', (req, res) => {})

  return router
}
