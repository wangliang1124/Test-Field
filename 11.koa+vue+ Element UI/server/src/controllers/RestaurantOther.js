import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 返回平台菜系，如果城市为空返回全部
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.RestaurantOther)
  try {
    const others = await ctx.models.RestaurantOther.findAll(where)
    ctx.rest(others)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个菜系
 */
export const PostOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('intro').optional().isString('intro must be a int')
  ctx.checkBody('other').notEmpty('other can not be null').isString('other must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    const other = await ctx.models.RestaurantOther.create({
      other: ctx.request.body.other,
      intro: ctx.request.body.intro
    })
    ctx.rest(other)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 删除一个菜系
 */
export const DelectOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').notEmpty('id can not be null').isInt('id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let other = await ctx.models.RestaurantOther.findById(ctx.params.id)
  if (!other) throw new APIError(404, ErrorsCategory[4], '不存在的菜系id')
  try {
    other = await other.destroy()
    ctx.rest(other)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
