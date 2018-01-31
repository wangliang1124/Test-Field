const env = process.env.NODE_ENV || 'development'
const debug = require('debug')('app')
export const logger = (app) => {
  return async (ctx, next) => {
    if (env === 'development') { // development logger
      debug('body:' + JSON.stringify(ctx.request.body))
      debug('query:' + JSON.stringify(ctx.query))
    } else { // procution logger

    }
    return next()
  }
}
