import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 普通用户获取自己的消息列表 管理员获取平台所有的消息列表
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.UserNews)
  try {
    if (ctx.state.user.isAdmin) {
      const news = await ctx.models.UserNews.findAndCountAll(where)
      ctx.rest(news)
    } else {
      if (!where.where) {
        where.where = {}
      }
      where.where.user_id = ctx.state.user.uuid
      const news = await ctx.models.UserNews.findAndCountAll(where)
      ctx.rest(news)
    }
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 管理员创建一批用户消息,需要管理员登录
 * @param {titile} String 消息的标题
 * @param {content} String 消息的内容
 * @param {url} String Option 消息的外链
 * @param {case} String 发送对象，因发送对象可能比较复杂，所以简单粗暴按照不同类型分别写
 */
export const PostOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('title').notEmpty('title can not be null').isString('title must be a string')
  ctx.checkBody('content').notEmpty('content can not be null').isString('content must be a string')
  ctx.checkBody('case').notEmpty('case can not be null').isString('case must be a string')
  ctx.checkBody('url').optional().isString('intro must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  try {
    let users
    switch (ctx.request.body.case) {
      case '0': // 全部用户
        users = await ctx.models.User.findAll()
        break
      case '1': // 全部男性
        users = await ctx.models.User.findAll({where: {sex: '1'}})
        break
      case '2': // 全部女性
        users = await ctx.models.User.findAll({where: {sex: '2'}})
        break
      case '3': // 未知性别
        users = await ctx.models.User.findAll({where: {sex: '0'}})
        break
      case '4': // 北京地区
        users = await ctx.models.User.findAll({where: {province: '北京'}})
        break
      case '5': // 上海地区
        users = await ctx.models.User.findAll({where: {province: '上海'}})
        break
      case '6': // 一周未登录
        users = await ctx.models.User.findAll({where: {
          last_login: {
            $lte: (Date.now() - 1000 * 60 * 60 * 24 * 7)
          }
        }})
        break
      case '7': // 一月未登录
        users = await ctx.models.User.findAll({where: {
          last_login: {
            $lte: (Date.now() - 1000 * 60 * 60 * 24 * 30)
          }
        }})
        break
      case '8': // 会员
        users = await ctx.models.User.findAll({where: {province: '北京'}})
        break
      case '9': // 非会员
        users = await ctx.models.User.findAll({where: {province: '北京'}})
        break
      default:
        users = await ctx.models.User.findAll()
        break
    }
    const newsArray = users.map(u => {
      return {
        title: ctx.request.body.title,
        content: ctx.request.body.content,
        url: ctx.request.body.url,
        user_id: u.id,
        created_at: Date.now(),
        updated_at: Date.now()
      }
    })
    const news = await ctx.models.UserNews.bulkCreate(newsArray)
    ctx.rest(news)
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 根据id获取一条消息 需要登录
 * @param {id} ctx 用户的id
 */
export const GetOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  try {
    // 获取用户信息
    let user = await ctx.models.User.findById(ctx.params.id)
    if (!user) throw new Error('找不到用户')
    // 获取用户的会员卡信息
    let userVip = await ctx.models.UserVip.findOne({
      where: {
        user_id: user.id
      },
      order: 'created_at DESC'
    })
    let vip = {
      isVip: !(!userVip || userVip.status === 0),
      name: userVip ? userVip.name : null,
      no: userVip ? userVip.no : null,
      start_time: userVip ? userVip.start_time : null,
      expire_time: userVip ? userVip.expire_time : null,
      status: userVip ? userVip.status : null,
      created_at: userVip ? userVip.created_at : null,
      updated_at: userVip ? userVip.updated_at : null
    }
    ctx.rest({
      user_info: user,
      user_vip: vip
    })
  } catch (err) {
    throw new APIError(400, ErrorsCategory[4], err.message)
  }
}
