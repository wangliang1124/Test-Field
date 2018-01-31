import * as Sms from '../controllers/Sms'
module.exports = {
  '*': async (ctx, next) => Sms.entryVerify(ctx, next), // 路由类的统一入口验证
  'POST /sms/:code': async (ctx, next) => Sms.VerifyOne(ctx, next), // 验证一条短信
  'POST /sms': async (ctx, next) => Sms.PostOne(ctx, next) // 发送一条短信
}
