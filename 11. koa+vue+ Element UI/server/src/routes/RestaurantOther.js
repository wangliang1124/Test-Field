import * as RestaurantOther from '../controllers/RestaurantOther'
module.exports = {
  '*': async (ctx, next) => RestaurantOther.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /other': async (ctx, next) => RestaurantOther.GetList(ctx, next), // 获取上传列表
  'POST /other': async (ctx, next) => RestaurantOther.PostOne(ctx, next), // 创建一个商圈
  'PUT /other/:id': async (ctx, next) => RestaurantOther.PutOne(ctx, next), // 更新一个商圈
  'DELETE /other/:id': async (ctx, next) => RestaurantOther.DelectOne(ctx, next) // 删除一个商圈
}
