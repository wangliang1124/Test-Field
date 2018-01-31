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
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.RestaurantCuisine)
  try {
    const cuisines = await ctx.models.RestaurantCuisine.findAll(where)
    ctx.rest(cuisines)
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
  ctx.checkBody('cuisine').notEmpty('cuisine can not be null').isString('cuisine must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    const cuisine = await ctx.models.RestaurantCuisine.create({
      cuisine: ctx.request.body.cuisine,
      intro: ctx.request.body.intro
    })
    ctx.rest(cuisine)
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
  let cuisine = await ctx.models.RestaurantCuisine.findById(ctx.params.id)
  if (!cuisine) throw new APIError(404, ErrorsCategory[4], '不存在的菜系id')
  try {
    cuisine = await cuisine.destroy()
    ctx.rest(cuisine)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
