import * as Area from '../controllers/Area'
module.exports = {
  '*': async (ctx, next) => Area.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /area': async (ctx, next) => Area.GetList(ctx, next), // 获取系统开通城市列表
  'POST /area': async (ctx, next) => Area.PostOne(ctx, next) // 开通一个业务城市
}
