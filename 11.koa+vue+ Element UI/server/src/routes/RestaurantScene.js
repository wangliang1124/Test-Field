import * as RestaurantScene from '../controllers/RestaurantScene'
module.exports = {
  '*': async (ctx, next) => RestaurantScene.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /scene': async (ctx, next) => RestaurantScene.GetList(ctx, next), // 获取上传列表
  'POST /scene': async (ctx, next) => RestaurantScene.PostOne(ctx, next), // 创建一个商圈
  'PUT /scene/:id': async (ctx, next) => RestaurantScene.PutOne(ctx, next), // 更新一个商圈
  'DELETE /scene/:id': async (ctx, next) => RestaurantScene.DelectOne(ctx, next) // 删除一个商圈
}
