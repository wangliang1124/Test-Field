import * as RestaurantDistrict from '../controllers/RestaurantDistrict'
module.exports = {
  '*': async (ctx, next) => RestaurantDistrict.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /district': async (ctx, next) => RestaurantDistrict.GetList(ctx, next), // 获取上传列表
  'POST /district': async (ctx, next) => RestaurantDistrict.PostOne(ctx, next), // 创建一个商圈
  'PUT /district/:id': async (ctx, next) => RestaurantDistrict.PutOne(ctx, next), // 更新一个商圈
  'DELETE /district/:id': async (ctx, next) => RestaurantDistrict.DelectOne(ctx, next) // 删除一个商圈
}
