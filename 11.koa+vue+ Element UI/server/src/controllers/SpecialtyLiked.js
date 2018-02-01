import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取自己的点赞记录，管理员返回全部的记录
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.SpecialtyLiked)
  try {
    if (!ctx.state.user.isAdmin) {
      if (!where.where) {
        where.where = {}
      }
      where.where.user_id = ctx.state.user.uuid
    }
    where['include'] = [{
      model: ctx.models.Specialty
    }]
    if (ctx.query.restaurant_id) {
      if (!where.where) {
        where.where = {}
      }
      const specialtys = await ctx.models.Specialty.findAll({
        where: {
          restaurant_id: ctx.query.restaurant_id
        }
      })
      const ids = specialtys.map(s => s.id)
      where.where['specialty_id'] = {
        $in: ids
      }
    }
    const likes = await ctx.models.SpecialtyLiked.findAndCountAll(where)
    likes.rows.forEach(l => {
      l.specialty.set('isLiked', true, {
        raw: true
      })
    })
    ctx.rest(likes)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PostOne = async (ctx, next) => {
  ctx.checkBody('specialty_id').notEmpty('specialty_id cannot be null').isInt('specialty_id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  try {
    let like = await ctx.models.SpecialtyLiked.findOne({where: {user_id: ctx.state.user.uuid, specialty_id: ctx.request.body.specialty_id}})
    if (like) {
      ctx.rest(like)
    } else {
      like = await ctx.models.SpecialtyLiked.create({
        user_id: ctx.state.user.uuid,
        specialty_id: ctx.request.body.specialty_id
      })
      const specialty = await ctx.models.Specialty.findById(ctx.params.specialty_id)
      specialty.collected = specialty.collected + 1
      await specialty.save()
      ctx.rest(like)
    }
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
  ctx.checkParams('specialty_id').notEmpty('specialty_id cannot be null').isInt('specialty_id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  let like = await ctx.models.SpecialtyLiked.findOne({where: {specialty_id: ctx.params.specialty_id, user_id: ctx.state.user.uuid}})
  if (!like) throw new APIError(404, ErrorsCategory[4], '找不到改点赞信息')
  if (like.user_id !== ctx.state.user.uuid) throw new APIError(400, ErrorsCategory[2], '不是自己的点赞记录')
  try {
    like = await like.destroy()
    const specialty = await ctx.models.Specialty.findById(ctx.request.body.specialty_id)
    specialty.collected = specialty.collected - 1
    await specialty.save()
    ctx.rest(like)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
