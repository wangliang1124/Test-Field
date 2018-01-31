import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取系统所有开通城市
 */
export const GetList = async (ctx, next) => {
  try {
    const citys = await ctx.models.RestaurantArea.findAll()
		ctx.rest(citys)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 开通一个城市,需要管理员权限
 * @param {city} 开通城市名称
 * @param {province_code} 开通城市简称
 * @param {intro} 开通城市原因
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('city').notEmpty('city can not be null').isString('city must be a string')
	ctx.checkBody('province_code').notEmpty('province_code can not be null').isString('province_code must be a string')
  ctx.checkBody('location_x').notEmpty('location_x can not be null').isFloat('location_x must be a float')
  ctx.checkBody('location_y').notEmpty('location_y can not be null').isFloat('location_y must be a float')
	ctx.checkBody('intro').notEmpty('intro can not be null').isString('intro must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
		let city = await ctx.models.RestaurantArea.findOne({where: {city: ctx.request.body.city}})
		if (city) throw new APIError(400, ErrorsCategory[2], '该城市已开通，无需再次开通')
		city = await ctx.models.RestaurantArea.create({
			city: ctx.request.body.city,
			province_code: ctx.request.body.province_code,
			intro: ctx.request.body.intro,
      location_x: ctx.request.body.location_x,
      location_y: ctx.request.body.location_y
		})
		ctx.rest(city)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
