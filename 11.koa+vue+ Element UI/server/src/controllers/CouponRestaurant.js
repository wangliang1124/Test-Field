import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取优惠券列表
 */
export const GetList = async (ctx, next) => {
  try {
    const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.CouponRestaurant)
    if (!ctx.state.user.isAdmin) {
      if (!where.where) {
        where.where = {}
      }
      where.where.user_id = ctx.state.user.uuid
    }
    const coupons = await ctx.models.CouponRestaurant.findAndCountAll(where)
    ctx.rest(coupons)
    } catch (err) {
      throw new APIError(400, ErrorsCategory[2], err.message)
    }
}
/**
 * 创建一个优惠券 需要管理员权限
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 删除一个优惠券 管理员权限
 */
export const DelectOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let coupon = await ctx.models.CouponRestaurant.findById(ctx.params.id)
  if (!coupon) throw new APIError(400, ErrorsCategory[4], '不存在的coupon')
  coupon = await coupon.destroy()
  ctx.rest({id: coupon.id})
}
