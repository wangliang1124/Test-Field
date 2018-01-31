import * as Coupon from '../controllers/Coupon'
module.exports = {
  '*': async (ctx, next) => Coupon.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /coupon': async (ctx, next) => Coupon.GetList(ctx, next), // 获取平台优惠券列表
  'POST /coupon': async (ctx, next) => Coupon.PostOne(ctx, next), // 创建一个或多个优惠券
  'DELETE /coupon/:id': async (ctx, next) => Coupon.DeleteOne(ctx, next) // 删除一个优惠券
}
