import * as UserInvite from '../controllers/UserInvite'
module.exports = {
  '*': async (ctx, next) => UserInvite.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /invite': async (ctx, next) => UserInvite.GetList(ctx, next), // 获取平台用户的邀请记录
  'PUT /invite/:id': async (ctx, next) => UserInvite.PutOne(ctx, next), // 更新一个邀请关系
  'DELETE /invite/:id': async (ctx, next) => UserInvite.DelectOne(ctx, next) // 删除一个邀请记录
}
