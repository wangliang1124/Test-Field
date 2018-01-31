import * as RestaurantTag from '../controllers/RestaurantTag'
module.exports = {
  '*': async (ctx, next) => RestaurantTag.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /tag/restaurant': async (ctx, next) => RestaurantTag.GetList(ctx, next), // 获取商户标签列表
  'POST /tag/restaurant': async (ctx, next) => RestaurantTag.PostOne(ctx, next), // 创建一个商户标签
  'DELETE /tag/restaurant/:id': async (ctx, next) => RestaurantTag.DelectOne(ctx, next) // 删除一个商户标签
}
