import * as Everyday from '../controllers/Everyday'
module.exports = {
  '*': async (ctx, next) => Everyday.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /everyday/new': async (ctx, next) => Everyday.GetList(ctx, next) // 获取系统开通城市列表
}
