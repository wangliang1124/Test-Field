import * as CardActivation from '../controllers/CardActivation'
module.exports = {
  '*': async (ctx, next) => CardActivation.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /activation': async (ctx, next) => CardActivation.GetList(ctx, next), // 获取激活码列表
  'POST /activation': async (ctx, next) => CardActivation.PostOne(ctx, next), // 创建一个激活码
  'POST /activation/use': async (ctx, next) => CardActivation.PutOne(ctx, next), // 更新/使用一个激活码
  'DELETE /activation/:id': async (ctx, next) => CardActivation.DelectOne(ctx, next) // 删除一个激活码
}
