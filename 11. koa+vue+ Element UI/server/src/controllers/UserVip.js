import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取某个用户的全部会员卡记录,需要在查询参数里制定user_id
 * @param {id} Number 用户的ID
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.UserVip)
  try {
    if (!where.where) where.where = {}
    where.where.user_id = ctx.state.user.uuid
    where.where.status = '1'
    where['include'] = [{
      model: ctx.models.Card,
      include: [{
        model: ctx.models.RestaurantArea,
        order: 'id DESC'
      }]
    }]
    const cards = await ctx.models.UserVip.findAndCountAll(where)
    ctx.rest(cards)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const Verify = async (ctx, next) => {
  try {
    const card = await ctx.models.UserVip.findAll({
      where: {
        user_id: ctx.state.user.uuid,
        status: '1'
      },
      order: 'id DESC',
      include: [{
        model: ctx.models.Card,
        include: [{
          model: ctx.models.RestaurantArea,
          order: 'id DESC'
        }]
      }]
    })
    ctx.rest(card)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
