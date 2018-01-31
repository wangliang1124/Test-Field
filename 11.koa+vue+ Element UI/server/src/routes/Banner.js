import * as Banner from '../controllers/Banner'
module.exports = {
  '*': async (ctx, next) => Banner.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /banner': async (ctx, next) => Banner.GetList(ctx, next), // 获取banner列表
  'POST /banner': async (ctx, next) => Banner.PostOne(ctx, next), // 管理员创建一个banner
  'PUT /banner/:id': async (ctx, next) => Banner.PutOne(ctx, next), // 管理员更新一个banner
  'DELETE /banner/:id': async (ctx, next) => Banner.DeleteOne(ctx, next) // 管理员删除一个banner
}
