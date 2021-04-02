import express, { Router } from 'express'

export type IndexRouteArgs = {}

export function indexRouter(args: IndexRouteArgs): Router {
  const router = express.Router()

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
  })

  return router
}
