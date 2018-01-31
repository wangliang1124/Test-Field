import * as UserVip from '../controllers/UserVip'
module.exports = {
  '*': async (ctx, next) => UserVip.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /vip': async (ctx, next) => UserVip.GetList(ctx, next), // 获取某个用户的全部会员卡信息,
  'GET /vip/verify': async (ctx, next) => UserVip.Verify(ctx, next) // 获取某个用户的全部会员卡信息
}
