import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取所有尊享卡标签列表列表
 */
export const GetList = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  try {
    let tags = await ctx.models.CardTag.findAll()
    ctx.rest(tags)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个尊享卡标签列表,需要管理员权限
 * @param {price_unit} 尊享卡价格
 * @param {name} 尊享卡名称
 * @param {expire_in} 尊享卡失效时间
 * @param {expire_time} 尊享卡失效时间单位
 * @param {limit} 尊享卡使用限制
 * @param {intro} 尊享卡简介
 * @param {tags} Optional 尊享卡标签 字符串数组  如 ["高清", "超值"]
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('tag').notEmpty('tag can not be null').isString('tag must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    let tag = await ctx.models.CardTag.findOne({where: {tag: ctx.request.body.tag}})
    if (!tag) {
      tag = await ctx.models.CardTag.create({
        tag: ctx.request.body.tag
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
  let tag = await ctx.models.CardTag.findById(ctx.params.id)
  if (!tag) throw new APIError(400, ErrorsCategory[4], '不存在的tagID')
  let results = await ctx.models.CardToTag.findAll({
    where: {
      tag_id: tag.id
    }
  })
  if (results) results.forEach(async r => await r.update({deleted_at: Date.now()}))
  tag.deleted_at = Date.now()
  tag = await tag.save()
  ctx.rest({id: tag.id})
}
