import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取banner列表
 */
export const GetList = async (ctx, next) => {
  try {
    let where
    if (ctx.query.intro) {
      where = {
        order: 'id DESC',
        where: {
          intro: ctx.query.intro
        }
      }
    } else {
      where = {
        order: 'id DESC'
      }
    }
    let banners = await ctx.models.Banner.findAndCountAll(where)
    ctx.rest(banners)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个banner
 * @param {url} String banner图片地址
 * @param {alt} String banner图片alt
 * @param {link} String banner图片链接地址
 * @param {intro} String banner图片说明
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('url').notEmpty('url can not be null').isString('url must be a string')
  ctx.checkBody('alt').optional().isString('alt must be a string')
  ctx.checkBody('link').optional().isString('link must be a string')
  ctx.checkBody('intro').optional().isString('intro muset be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    let banner = await ctx.models.Banner.create({
      url: ctx.request.body.url,
      alt: ctx.request.body.alt,
      link: ctx.request.body.link,
      intro: ctx.request.body.intro
    })
    ctx.rest(banner)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 更新一个banner
 * @param {id} 要更新的bannerID
 * @param {url} 要更新的banner 图片地址
 * @param {alt} 要更新的banner alt
 * @param {link} 要更新的banner链接
 * @param {intro} 要更新的banner说明
 */
export const PutOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  ctx.checkBody('url').notEmpty('url can not be null').isString('url must be a string')
  ctx.checkBody('alt').optional().isString('alt must be a string')
  ctx.checkBody('link').optional().isString('link muset be a string')
  ctx.checkBody('intro').optional().isString('intro muset be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let banner = await ctx.models.Banner.findById(ctx.params.id)
  if (!banner) throw new APIError(400, ErrorsCategory[4], '不存在的bannerID')
  try {
    // 更新banner
    if (ctx.request.body.url) banner.url = ctx.request.body.url
    if (ctx.request.body.alt) banner.alt = ctx.request.body.alt
    if (ctx.request.body.link) banner.link = ctx.request.body.link
    if (ctx.request.body.intro) banner.intro = ctx.request.body.intro
    banner = await banner.save({
      fields: ['url', 'alt', 'link', 'intro']
    })
    ctx.rest(banner)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const DeleteOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    let banner = await ctx.models.Banner.findById(ctx.params.id)
    if (!banner) throw new APIError(400, ErrorsCategory[4], '不存在的bannerId')
    banner = await banner.destroy()
    ctx.rest({id: banner.id})
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
