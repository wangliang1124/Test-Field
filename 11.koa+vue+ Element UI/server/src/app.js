import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import {System as SystemConfig} from './config/'
import path from 'path'
// import cors from 'koa-cors'
import convert from 'koa-convert'
import koaLogger from 'koa-logger'
import compress from 'koa-compress'  // 2017.12.20 新增用于压缩数据
import sacnRoutes from './routes/'
import {restify} from './middlewares/restify'
import {logger} from './middlewares/logger'
import Validate from './lib/koa-validate'

const model = require('./models/')
// model.models.CardCity.sync({force: true})
// model.models.OrderGroup.sync({force: true})
// model.models.Invoice.sync({force: true})
const app = new Koa2()
const env = process.env.NODE_ENV || 'development'
Validate(app)
app
  .use(KoaBody({
    multipart: true,
    strict: false,
    jsonLimit: '20mb',
    formLimit: '10mb',
    textLimit: '20mb',
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads')
    }
  }))
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', false) // 允许带上 cookie
    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = 200
    }
    ctx.models = model.models
    ctx.sequelize = model.sequelize
    return next()
  })
  .use(compress({ // 启用gzip压缩
    // filter: function (contentType) {
    //   return /text/i.test(contentType)
    // },
    threshold: 1024,
    flush: require('zlib').Z_SYNC_FLUSH
  }))
  .use(restify())
  .use(sacnRoutes())
  .use(convert(koaLogger()))
  .use(logger())
  .on('error', err =>
    console.error('server error', err)
  )

app.listen(SystemConfig.API_server_port)

process.on('uncaughtException', (err) => {
  console.error(' Caught exception: ' + err.stack)
})

console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')
console.log('app environment: ' + env)
export default app

