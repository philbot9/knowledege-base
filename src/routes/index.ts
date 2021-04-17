import express, { Router } from 'express'
import { viewGlobals } from '../util/view-globals'

export type IndexRouterArgs = {}

export function indexRouter(args: IndexRouterArgs): Router {
  const router = express.Router()

  router.use((req, res, next) => {
    if (!req.session?.userId) {
      return res.redirect('/signin')
    }
    next()
  })

  /* GET home page. */
  router.get('/', function (req, res) {
    res.render('index', {
      title: viewGlobals.appName + ' - Home',
      breadcrumb: 'Home',
      user: req.session?.user
    })
  })

  return router
}
