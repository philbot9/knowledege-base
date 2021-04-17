import createError from 'http-errors'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import cookieSession from 'cookie-session'
import helmet from 'helmet'
import logger from 'morgan'

import { indexRouter } from './routes/index'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { isDev } from './util/is-dev'
import { config } from './util/config'
import { UserDiskRepository } from './repositories/UserDiskRepository'
import { UserRegistration } from './domain/User/UserRegistration'
import { Crypto } from './domain/util/Crypto'
import { UserAuthentication } from './domain/User/UserAuthentication'
import { signupRouter } from './routes/signup'

export async function buildApp() {
  const app = setupExpressApp()

  const crypto = new Crypto()
  const userRepo = new UserDiskRepository()
  const userRegistration = new UserRegistration({
    userRepo,
    crypto
  })
  const userAuthentication = new UserAuthentication({
    userRepo,
    crypto
  })

  app.use(async (req, res, next) => {
    if (req.session?.userId && !res.locals.user) {
      try {
        res.locals.user = await userRepo.read(req.session.userId)
      } catch (e) {
        req.session = null
        res.redirect('/signin')
      }
    } else {
      res.locals.user = null
    }
    next()
  })

  app.use('/signin', signinRouter({ userAuthentication }))
  app.use('/signup', signupRouter({ userRegistration }))
  app.use('/signout', signoutRouter({}))
  app.use('/', indexRouter({}))

  installNotFoundRoute(app)
  installErrorRoute(app)

  return app
}

function setupExpressApp(): Application {
  const app = express()

  // view engine setup
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')

  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(helmet({ contentSecurityPolicy: false }))

  const { cookieKeys, domain } = config()

  app.use(
    cookieSession({
      name: 'session',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: 'kb/session',
      secureProxy: !isDev(),
      httpOnly: true,
      keys: cookieKeys,
      domain
    })
  )

  app.use(express.static(path.join(__dirname, '../public')))

  return app
}

function installNotFoundRoute(app: Application): Application {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  return app
}

function installErrorRoute(app: Application): Application {
  // error handler
  app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  return app
}
