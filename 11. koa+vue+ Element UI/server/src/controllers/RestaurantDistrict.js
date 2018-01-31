import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 根据城市返回商圈列表，如果城市为空返回全部
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.RestaurantDistrict)
  try {
    where['include'] = [{
      model: ctx.models.RestaurantArea,
      where: {}
    }]
    if (ctx.query.restaurant_area) {
      where.include[0].where = {
        city: ctx.query.restaurant_area
      }
    }
    const districts = await ctx.models.RestaurantDistrict.findAll(where)
    ctx.rest(districts)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个商圈,需要城市参数
 */
export const PostOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('restaurant_area_id').notEmpty('restaurant_area_id can not be null').isInt('restaurant_area_id must be a int').toInt()
  ctx.checkBody('intro').optional().isString('intro must be a int')
  ctx.checkBody('district').notEmpty('district can not be null').isString('district must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const area = await ctx.models.RestaurantArea.findById(ctx.request.body.restaurant_area_id)
  if (!area) throw new APIError(404, ErrorsCategory[4], '不存在的地区id')
  try {
    const district = await ctx.models.RestaurantDistrict.create({
      district: ctx.request.body.district,
      intro: ctx.request.body.intro,
      restaurant_area_id: area.id
    })
    ctx.rest(district)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 更新一个商圈
 */
export const PutOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('district_id').noEmpty('district_id can not be null').isInt('district_id must be a int').toInt()
  ctx.checkBody('intro').optional().isString('intro must be a int')
  ctx.checkBody('district').optional().isString('district must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const district = await ctx.models.RestaurantDistrict.findById(ctx.request.body.district_id)
  if (!district) throw new APIError(404, ErrorsCategory[4], '不存在的商圈id')
  try {
    const district = await ctx.models.RestaurantDistrict.update({
      district: ctx.request.body.district,
      intro: ctx.request.body.intro,
      restaurant_area_id: ctx.request.body.restaurant_area_id
    })
    ctx.rest(district)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 删除一个商圈
 */
export const DelectOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').notEmpty('id can not be null').isInt('id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let district = await ctx.models.RestaurantDistrict.findById(ctx.params.id)
  if (!district) throw new APIError(404, ErrorsCategory[4], '不存在的商圈id')
  try {
    district = await district.destroy()
    ctx.rest(district)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
