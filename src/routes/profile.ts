import express, { Router } from 'express'
import { viewGlobals } from '../util/view-globals'

export type ProfileRouterArgs = {}

export function profileRouter(args: ProfileRouterArgs): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    if (!req.session?.userId) {
      return res.redirect('/signin')
    }
    next()
  })

  /* GET home page. */
  router.get('/', function (req, res) {
    res.render('profile', {
      title: viewGlobals.appName + ' - Home',
      breadcrumb: 'Profile'
    })
  })

  return router
}
