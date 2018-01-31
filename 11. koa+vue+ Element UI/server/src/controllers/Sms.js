import request from 'request'
import Promise from 'bluebird'
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
export const PostOne = async (ctx) => {
  ctx.checkBody('phone').notEmpty('phone cannot be null').isInt('phone must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/requestSmsCode',
    headers: {
      'X-LC-Id': 'sxLFcpvpHVcb4a070BoxhR3q-gzGzoHsz',
      'X-LC-Key': 'Mrm4LhUU2gh9HCNqgha3eXNM',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'mobilePhoneNumber': `${ctx.request.body.phone}`,
      'template': '绑定手机号'
    })
  }
  try {
    const result = await requestPromise(options)
    ctx.rest(result)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const VerifyOne = async (ctx) => {
  ctx.checkParams('code').notEmpty('code cannot be null').isInt('code must be a int').toInt()
  ctx.checkBody('phone').notEmpty('phone cannot be null').isInt('phone must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const options = {
    method: 'POST',
    url: `https://api.leancloud.cn/1.1/verifySmsCode/${ctx.params.code}?mobilePhoneNumber=${ctx.request.body.phone}`,
    headers: {
      'X-LC-Id': 'sxLFcpvpHVcb4a070BoxhR3q-gzGzoHsz',
      'X-LC-Key': 'Mrm4LhUU2gh9HCNqgha3eXNM',
      'Content-type': 'application/json'
    }
  }
  try {
    const result = await requestPromise(options)
    ctx.rest(result)
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
function requestPromise (options) {
  return new Promise((resolve, reject) => {
    request(options, function (err, response, body) {
      if (err) reject(err)
      const info = JSON.parse(body)
      if (!err && response.statusCode === 200) {
        resolve(info)
      } else {
        reject(new Error(info.error))
      }
    })
  })
}
