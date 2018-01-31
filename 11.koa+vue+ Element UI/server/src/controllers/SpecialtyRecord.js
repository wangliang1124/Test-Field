import moment from 'moment'
import Redis from 'ioredis'
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
const redis = new Redis(6379, '127.0.0.1')
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取特权使用记录，管理员获取全部，用户获取自己的
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.SpecialtyRecord)
  if (!ctx.state.user.isAdmin) {
    if (!where.where) {
      where.where = {}
    }
    where.where.user_id = ctx.state.user.uuid
  }
  where['include'] = [{
    model: ctx.models.Specialty,
    include: [{
      model: ctx.models.Restaurant
    }]
  }]
  try {
    const records = await ctx.models.SpecialtyRecord.findAndCountAll(where)
    ctx.rest(records)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个特权使用记录
 * @param {speciaty_id} 购买的会员卡id
 */
export const PostOne = async (ctx) => {
  ctx.checkBody('price').notEmpty('price cannot be null').isInt('price must be a int').toInt()
  ctx.checkBody('specialty_id').notEmpty('specialty_id cannot be null').isInt('specialty_id must be a int').toInt()
  try {
    // 先验证是否是会员
    const vip = await ctx.models.UserVip.findOne({
      where: {
        user_id: ctx.state.user.uuid,
        status: '1'
      }
    })
    if (!vip) throw new APIError(400, ErrorsCategory[2], '您还不是会员,不能享用')
    const record = await ctx.models.SpecialtyRecord.create({
      specialty_id: ctx.request.body.specialty_id,
      user_id: ctx.state.user.uuid,
      money: ctx.request.body.price
    })
    let year = moment().year()
    let day = moment().dayOfYear()
    let loginKey = `record:${year}-${day}`
    let now = Math.floor(Date.now() / 1000)
    await redis.zadd(loginKey, now, record.id)
    ctx.rest(record)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}

export const PutOne = async (ctx, next) => {
}

export const DeleteOne = async (ctx, next) => {
}
