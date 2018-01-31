import * as Wx from '../controllers/Wx'
module.exports = {
  '*': async (ctx, next) => Wx.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /wx/signature': async (ctx, next) => Wx.GetSignature(ctx, next), // 获取jssdk的signature
  'POST /wx/pay': async (ctx, next) => Wx.Pay(ctx, next) // 微信支付
}
