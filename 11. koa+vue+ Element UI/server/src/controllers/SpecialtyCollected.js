import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
const sequelize = require('sequelize')
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取自己的收藏记录，管理员返回全部的记录
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.SpecialtyCollected)
  try {
    if (!ctx.state.user.isAdmin) {
      if (!where.where) {
        where.where = {}
      }
      where.where.user_id = ctx.state.user.uuid
    }
    where['include'] = [{
      model: ctx.models.Specialty,
      include: [{
        model: ctx.models.Restaurant,
        where: {
          // status: '1'
        },
        include: [{
          model: ctx.models.RestaurantDistrict
        }, {
          model: ctx.models.RestaurantCuisine
        }]
      }]
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
    console.log(where.where)
    const collects = await ctx.models.SpecialtyCollected.findAndCountAll(where)
    collects.rows.forEach(c => {
      c.specialty.set('isCollected', true, {
        raw: true
      })
    })
    ctx.rest(collects)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const GetRankList = async (ctx, next) => {   // 获取总收藏数&月收藏数top11
  let totalCount
  let monthCount
  let ranklist
  try {
    totalCount = ctx.models.SpecialtyCollected.findAll({ // 查询月排行数据
      /* SELECT specialty_id,count(*) AS total
         FROM specialty_collected
         GROUP BY specialty_id
         ORDER BY total DESC
         LIMIT 20
      */
      attributes: [['specialty_id', 'id'], [sequelize.fn('COUNT', sequelize.col('*')), 'totalCount']],
      group: 'specialty_id',
      order: 'totalCount DESC',
      limit: 11,
      include: {
        model: ctx.models.Specialty,
        attributes: ['cook_name', 'cook_avatar', 'cook_liked'],
        include: {
          model: ctx.models.Restaurant,
          where: {
            status: '1'
          },
          attributes: ['name', 'intro', 'cover', 'unit_average', 'score', 'location_x', 'location_y'],
          include: {
            model: ctx.models.RestaurantCuisine,
            attributes: ['cuisine']
          }
        }
      }
    })

    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime()  // 获取月初的时间戳
    monthCount = ctx.models.SpecialtyCollected.findAll({  // 查询月排行数据
      attributes: [['specialty_id', 'id'], [sequelize.fn('COUNT', sequelize.col('*')), 'monthCount']],
      group: 'specialty_id',
      order: 'monthCount DESC',
      limit: 11,
      where: {
        updated_at: {
          $gt: firstDay
        }
      },
      include: {
        model: ctx.models.Specialty,
        attributes: ['cook_name', 'cook_avatar', 'cook_liked'],
        include: {
          model: ctx.models.Restaurant,
          where: {
            status: '1'
          },
          attributes: ['name', 'cover', 'unit_average', 'score', 'location_x', 'location_y'],
          include: {
            model: ctx.models.RestaurantCuisine
          }
        }
      }
    })
    ranklist = await Promise.all([totalCount, monthCount])
    if (ranklist && ranklist.length !== 0) {
      console.log('===========success==========')
      console.log(ranklist)
      ctx.rest(ranklist)
    } else {
      ctx.throw(404, '参数错误 | 查找不到数据')
    }
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
    let collect = await ctx.models.SpecialtyCollected.findOne({where: {user_id: ctx.state.user.uuid, specialty_id: ctx.request.body.specialty_id}})
    if (collect) {
      ctx.rest(collect)
    } else {
      collect = await ctx.models.SpecialtyCollected.create({
        user_id: ctx.state.user.uuid,
        specialty_id: ctx.request.body.specialty_id
      })
      const specialty = await ctx.models.Specialty.findById(ctx.request.body.specialty_id)
      specialty.collected = specialty.collected + 1
      await specialty.save()
      ctx.rest(collect)
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
  let collect = await ctx.models.SpecialtyCollected.findOne({where: {specialty_id: ctx.params.specialty_id, user_id: ctx.state.user.uuid}})
  if (!collect) throw new APIError(404, ErrorsCategory[4], '找不到改点赞信息')
  if (collect.user_id !== ctx.state.user.uuid) throw new APIError(400, ErrorsCategory[2], '不是自己的收藏记录')
  try {
    const specialty = await ctx.models.Specialty.findById(parseInt(ctx.params.specialty_id))
    specialty.collected = specialty.collected - 1
    await specialty.save()
    collect = await collect.destroy()
    ctx.rest(collect)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
