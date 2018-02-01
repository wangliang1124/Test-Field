import * as Restaurant from '../controllers/Restaurant'
module.exports = {
  '*': async (ctx, next) => Restaurant.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /restaurant': async (ctx, next) => Restaurant.GetList(ctx, next), // 获取平台入住商户列表
  'GET /restaurant/:id': async (ctx, next) => Restaurant.GetOne(ctx, next), // 获取平台入住商户列表
  'GET /restaurant/recommend/:id': async (ctx, next) => Restaurant.GetRecommend(ctx, next),
  'GET /restaurant_all': async (ctx, next) => Restaurant.GetAll(ctx, next),
  'GET /restaurant_rank': async (ctx, next) => Restaurant.GetTop11(ctx, next),
  'POST /restaurant': async (ctx, next) => Restaurant.PostOne(ctx, next), // 入住一个商户
  'PUT /restaurant/:id': async (ctx, next) => Restaurant.PutOne(ctx, next), // 更新一个商户信息
  'PUT /restaurant/stop/:id': async (ctx, next) => Restaurant.StopOne(ctx, next), // 停止一个商户的服务
  'PUT /restaurant/start/:id': async (ctx, next) => Restaurant.StartOne(ctx, next) // 开启一个商户的服务
}
