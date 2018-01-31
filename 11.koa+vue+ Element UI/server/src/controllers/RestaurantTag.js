import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取所有商户标签列表列表
 */
export const GetList = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  try {
    let tags = await ctx.models.RestaurantTag.findAll()
    ctx.rest(tags)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个商户标签列表,需要管理员权限
 * @param {tag} 标签名称
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('tag').notEmpty('tag can not be null').isString('tag must be a string')
  ctx.checkBody('intro').optional().isString('intro must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    let tag = await ctx.models.RestaurantTag.findOne({where: {tag: ctx.request.body.tag}})
    if (!tag) {
      tag = await ctx.models.RestaurantTag.create({
        tag: ctx.request.body.tag,
        intro: ctx.request.body.intro
      })
    }
    ctx.rest(tag)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const DelectOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let tag = await ctx.models.RestaurantTag.findById(ctx.params.id)
  if (!tag) throw new APIError(400, ErrorsCategory[4], '不存在的tagID')
  let results = await ctx.models.RestaurantToTag.findAll({
    where: {
      restaurant_tag_id: tag.id
    }
  })
  if (results) results.forEach(async r => await r.destroy())
  tag = await tag.destroy()
  ctx.rest({id: tag.id})
}
