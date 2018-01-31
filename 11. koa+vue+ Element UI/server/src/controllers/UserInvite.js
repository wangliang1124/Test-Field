import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取邀请记录的列表，普通用户返回他自己的列表 管理员返回全部数据
 */
export const GetList = async (ctx, next) => {
  console.log('=============+>')
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.UserInvite)
  try {
    if (!ctx.state.user.isAdmin) where['inviter_id'] = ctx.state.user.uuid
    where['include'] = [{
      model: ctx.models.User
    }]
    const invites = await ctx.models.UserInvite.findAndCountAll(where)
    ctx.rest(invites)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 更新一个邀请关系
 */
export const PutOne = async (ctx, next) => {

}
/**
 * 删除一个邀请关系
 */
export const DelectOne = async (ctx, next) => {
  ctx.rest()
}
