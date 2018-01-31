import * as CouponRestaurant from '../controllers/CouponRestaurant'
module.exports = {
  '*': async (ctx, next) => CouponRestaurant.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /coupon/restaurant': async (ctx, next) => CouponRestaurant.GetList(ctx, next), // 获取平台优惠券列表
  'POST /coupon/restaurant': async (ctx, next) => CouponRestaurant.PostOne(ctx, next), // 创建一个或多个优惠券
  'DELETE /coupon/restaurant/:id': async (ctx, next) => CouponRestaurant.DeleteOne(ctx, next) // 删除一个优惠券
}
