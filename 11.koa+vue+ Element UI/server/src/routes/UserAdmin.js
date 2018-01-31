import * as UserAdmin from '../controllers/UserAdmin'
module.exports = {
  '*': async (ctx, next) => UserAdmin.entryVerify(ctx, next), // 路由类的统一入口验证
  'POST /admin/signin': async (ctx, next) => UserAdmin.signIn(ctx, next) // 管理员登录
}
