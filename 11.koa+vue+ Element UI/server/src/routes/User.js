import * as User from '../controllers/User'
module.exports = {
  '*': async (ctx, next) => User.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /user': async (ctx, next) => User.GetList(ctx, next), // 获取用户列表
  'GET /user/:id': async (ctx, next) => User.GetOne(ctx, next), // 获取某一个用户信息
  'PUT /user/:id': async (ctx, next) => User.PutOne(ctx, next), // 更新一个用户信息
  'POST /user/signin': async (ctx, next) => User.signIn(ctx, next) // 用户登录
}
