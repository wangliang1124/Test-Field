import {ErrorsCategory} from '../config/'
module.exports = {
  APIError: function (status, code, message) {
    this.status = status || 500
    this.code = code || ErrorsCategory[0]
    this.message = message || ''
  },
  restify: (pathPrefix) => {
    pathPrefix = pathPrefix || '/api/'
    return async (ctx, next) => {
      if (ctx.request.path.startsWith(pathPrefix)) {
        // 绑定rest()方法:
        ctx.rest = (data) => {
          ctx.response.type = 'application/json'
          ctx.response.body = {
            message: 'success',
            data: data
          }
        }
        try {
          await next()
        } catch (e) {
          ctx.response.status = e.status ? e.status : 500
          ctx.response.type = 'application/json'
          ctx.response.body = {
            code: e.code || ErrorsCategory[0],
            message: e.message || ''
          }
        }
      } else {
        await next()
      }
    }
  }
}
