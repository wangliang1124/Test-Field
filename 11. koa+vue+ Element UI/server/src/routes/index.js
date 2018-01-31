import fs from 'fs'
import {System} from '../config/'
import _path from 'path'
import koaJWT from 'koa-jwt'
function addMapping (router, mapping) {
  let path
  for (var url in mapping) {
    if (url.startsWith('*')) {
      router.use(mapping[url])
    } else if (url.startsWith('GET ')) {
      path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      path = url.substring(4)
      router.put(path, mapping[url])
      console.log(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      path = url.substring(7)
      router.delete(path, mapping[url])
      console.log(`register URL mapping: DELETE ${path}`)
    } else if (url.startsWith('PATCH ')) {
      path = url.substring(6)
      router.patch(path, mapping[url])
      console.log(`register URL mapping: PATCH ${path}`)
    } else if (url.startsWith('ALL ')) {
      path = url.substring(4)
      router.all(path, mapping[url])
      console.log(`register URL mapping: all ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}
function addRoutes (router, routesDir) {
  const files = fs.readdirSync(__dirname)
  const jsFiles = files.filter((f) => {
    return f.endsWith('.js') && f !== 'index.js'
  })
  for (let f of jsFiles) {
    console.log(`process routers: ${f}...`)
    const mapping = require(_path.join(__dirname, f))
    addMapping(router, mapping)
  }
}
module.exports = function () {
  const routesDir = __dirname // 如果不传参数，扫描目录默认为'routes'
  const router = require('koa-router')({prefix: `/api/${System.API_version}`})
  router.use(koaJWT({
    secret: System.JWT_secret
  }).unless({
    path: [/^\/api\/v1\/(user|admin|wx|upload|protocol|excel|everyday)\/(signin|auth|signature|image|new|base64|wx|order|type)/,
      '/api/v1/area',
      '/api/v1/banner',
      '/api/v1/district',
      // '/api/v1/specialty',
      // /^\/api\/v1\/specialty\/\d+/,
      '/api/v1/cuisine',
      '/api/v1/scene',
      '/api/v1/other'
      // '/api/v1/user',
    ]}))
  addRoutes(router, routesDir)
  return router.routes()
}

