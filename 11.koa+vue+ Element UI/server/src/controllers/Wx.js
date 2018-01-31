const WechatAPI = require('wechat-api')
const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const middleware = require('wechat-pay').middleware
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {System} from '../config/'

Promise.promisifyAll(WechatAPI.prototype)
const wxApi = new WechatAPI(System.pubWxAppId, System.pubWxAppSecret)
var initConfig = {
  partnerKey: 'ysjysjysjysjysjysjysjysjysjysj12',
  appId: 'wxfc34b0cedd6ce73f',
  mchId: '1335827501',
  notifyUrl: 'http://ysj.tcfellow.com:3000/api/v1/wx/pay',
  pfx: fs.readFileSync(path.resolve(__dirname, '../../cert/apiclient_cert.p12'))
}
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取微信jssdk的 signature
 */
export const GetSignature = async (ctx, next) => {
  try {
    const url = decodeURIComponent(ctx.request.query.url)
    const signature = await wxApi.getJsConfigAsync({ url })
    ctx.rest(signature)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}

export const Pay = middleware(initConfig).getNotify().done((message, ctx, next) => {
  console.log('===========>>>>>>>>>>')
  // var openid = message.openid
  // var order_id = message.out_trade_no
  // var attach = {}
  console.log(message)
  console.log(ctx.request.body)
})
