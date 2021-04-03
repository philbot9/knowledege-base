import express, { Router } from 'express'

export type EntriesApiRouterArgs = {}

export function entriesApiRouter(args: EntriesApiRouterArgs): Router {
  const router = express.Router()

  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
  })

  return router
}
