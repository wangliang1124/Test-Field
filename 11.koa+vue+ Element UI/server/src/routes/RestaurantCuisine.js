import * as RestaurantCuisine from '../controllers/RestaurantCuisine'
module.exports = {
  '*': async (ctx, next) => RestaurantCuisine.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /cuisine': async (ctx, next) => RestaurantCuisine.GetList(ctx, next), // 获取上传列表
  'POST /cuisine': async (ctx, next) => RestaurantCuisine.PostOne(ctx, next), // 创建一个商圈
  'PUT /cuisine/:id': async (ctx, next) => RestaurantCuisine.PutOne(ctx, next), // 更新一个商圈
  'DELETE /cuisine/:id': async (ctx, next) => RestaurantCuisine.DelectOne(ctx, next) // 删除一个商圈
}
