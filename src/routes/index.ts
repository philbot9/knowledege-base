import express, { Router } from 'express'

export type IndexRouterArgs = {}

export function indexRouter(args: IndexRouterArgs): Router {
  const router = express.Router()

  /* GET home page. */
  router.get('/', function (req, res) {
    if (!req.session?.userId) {
      res.redirect('/signin')
      return
    }

    res.render('index', {
      title: 'Owby',
      user: false
    })
  })

  return router
}
