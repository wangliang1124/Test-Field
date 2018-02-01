import moment from 'moment'
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
import {sequelize} from '../lib/sequelize'
export const entryVerify = async (ctx, next) => {
  return next()
}
const util = require('util')  // 用于引入调试工具inspect
// const Sequelize = require('sequelize')
/**
 * 获取平台入住商户列表
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.Restaurant)
  where['include'] = [{
    model: ctx.models.RestaurantArea
  }, {
    model: ctx.models.RestaurantImg
  }, {
    model: ctx.models.RestaurantOpentime,
    required: false
  }, {
    model: ctx.models.RestaurantTag,
    required: false,
    through: {
      model: ctx.models.RestaurantToTag,
      attributes: ['id', 'restaurant_id', 'restaurant_tag_id', 'created_at', 'updated_at'],
      where: {
        deleted_at: null
      }
    }
  }, {
    model: ctx.models.RestaurantDistrict,
    required: false
  }, {
    model: ctx.models.RestaurantCuisine,
    required: false
  }, {
    model: ctx.models.RestaurantOther,
    required: false
  }, {
    model: ctx.models.RestaurantScene,
    required: false
  }]
  try {
    const reses = await ctx.models.Restaurant.findAll(where)
    const count = await ctx.models.Restaurant.count()
		ctx.rest({
      rows: reses,
      count: count
    })
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const GetAll = async (ctx, next) => { // 获取所有餐厅数据
  // console.log('+++++++++++++++' + ctx.params)
  // const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.Restaurant)
  try {
    const res = await ctx.models.Restaurant.findAll({
      where: {
        deleted_at: null,
        status: '1'  // 添加筛选条件，'正常状态'才显示在可选列表中
      },
      attributes: ['id', 'name', 'status']
    })
    ctx.rest(res)
    // console.log('=================' + util.inspect(res))  // 调试
  } catch (err) {
    console.log('xxxxxxxxxxxxxxx' + err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const GetOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be an int').toInt()
  const id = ctx.params.id
  try {
    const res = await ctx.models.Restaurant.findById(id, {
      include: [{
        model: ctx.models.RestaurantArea
      }, {
        model: ctx.models.RestaurantImg
      }, {
        model: ctx.models.RestaurantOpentime
      }, {
        model: ctx.models.RestaurantTag,
        required: false,
        through: {
          model: ctx.models.RestaurantToTag,
          attributes: ['id', 'restaurant_id', 'restaurant_tag_id', 'created_at', 'updated_at'],
          where: {
            deleted_at: null
          }
        }
      }, {
        model: ctx.models.RestaurantDistrict
      }, {
        model: ctx.models.RestaurantCuisine
      }, {
        model: ctx.models.RestaurantOther,
        required: false
      }, {
        model: ctx.models.RestaurantScene,
        required: false
      }]
    })
    if (!res) {
      console.log('eeeeeeeeeeeeeeeeeeeeee')
      console.log(res)
      throw new APIError(404, ErrorsCategory[4], '==不存在的商户')
    }
		ctx.rest(res)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const GetRecommend = async (ctx, next) => {  // 获取推荐餐厅数据
  ctx.checkParams('id').notEmpty('id cannot be null')
  const id = ctx.params.id.split(',').map((value) => { return parseInt(value) })  // 把字符串数组转为数值数组
  // const id = JSON.parse('[' + ctx.params.id + ']')
  // console.log(id)
  try {
    const res = await ctx.models.Restaurant.findAll({
      where: {
        // id: 602874442973836
        id: {
          $in: id
        },
        status: '1'  // 添加筛选条件，'正常状态'才显示出来
      },
      include: [{
        model: ctx.models.Specialty
      }, {
        model: ctx.models.RestaurantArea
      }, {
        model: ctx.models.RestaurantImg
      }, {
        model: ctx.models.RestaurantOpentime
      }, {
        model: ctx.models.RestaurantTag,
        required: false,
        through: {
          model: ctx.models.RestaurantToTag,
          attributes: ['id', 'restaurant_id', 'restaurant_tag_id', 'created_at', 'updated_at'],
          where: {
            deleted_at: null
          }
        }
      }, {
        model: ctx.models.RestaurantDistrict
      }, {
        model: ctx.models.RestaurantCuisine
      }, {
        model: ctx.models.RestaurantOther,
        required: false
      }, {
        model: ctx.models.RestaurantScene,
        required: false
      }]
    })
    if (!res) throw new APIError(404, ErrorsCategory[4], '不存在的Rocommend商户')
    ctx.rest(res)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/* { city: '北京',
  name: '仿膳饭庄',
  unit_average: 1,
  tel: 11,
  intro: 'asdfasfasf',
  address: '北京市东交民巷37号',
  location_y: 116.400091,
  location_x: 39.902761,
  phone: 222,
  openTimes: [ { info: '上午', timeRange: [Object] } ],
  contract_time: '2017-06-27T17:05:53.705Z',
  uploadList:
   [ { url: 'http://localhost:3000/assets/uploads/9833543398861018.jpg',
       name: 'u=292050601,2473871589&fm=26&gp=0.jpg',
       status: 'finished' } ],
  tags_array:
   [ { id: 1, tag: '可停车', intro: '黑色', created_at: 0, updated_at: 0 },
     { id: 3, tag: '有wifi', intro: '哈哈', created_at: 0, updated_at: 0 },
     { id: 4,
       tag: '哟美女',
       intro: null,
       created_at: 1498581889233,
       updated_at: 1498581889233 } ],
  tags: [],
  input_tag: '' }
*/
/**
 * 入住一个商户,需要管理员权限
 * @param {city} 开通城市名称
 * @param {province_code} 开通城市简称
 * @param {intro} 开通城市原因
 */
export const PostOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('mapId').notEmpty('mapId can not be null').isString('mapId must be a string')
  ctx.checkBody('city').notEmpty('city can not be null').isString('city must be a string')
  ctx.checkBody('restaurant_cuisine_id').notEmpty('restaurant_cuisine_id can not be null').isInt('restaurant_cuisine_id must be a int')
  ctx.checkBody('scene_id').notEmpty('scene_id can not be null').isInt('scene_id must be a int')
  ctx.checkBody('other_id').notEmpty('other_id can not be null').isInt('other_id must be a int')
  ctx.checkBody('restaurant_district_id').notEmpty('restaurant_district_id can not be null').isInt('restaurant_district_id must be a int')
  ctx.checkBody('name').notEmpty('name can not be null').isString('name must be a string')
  ctx.checkBody('icons').notEmpty('icons can not be null').isString('icons must be a string')
  ctx.checkBody('tel').notEmpty('tel can not be null').isString('tel must be a string')
  ctx.checkBody('intro').notEmpty('intro can not be null').isString('intro must be a string')
  ctx.checkBody('address').notEmpty('address can not be null').isString('address must be a string')
  ctx.checkBody('contract_time').notEmpty('contract_time can not be null').isString('contract_time must be a string')
  ctx.checkBody('unit_average').notEmpty('unit_average can not be null').isInt('unit_average must be a int').toInt()
  ctx.checkBody('location_x').notEmpty('location_x can not be null').isFloat('location_x must be a float').toFloat()
  ctx.checkBody('location_y').notEmpty('location_y can not be null').isFloat('location_y must be a float').toFloat()
  ctx.checkBody('score').notEmpty('score can not be null').isFloat('score must be a float').toFloat()  // 新增 score
  ctx.checkBody('tags').optional().isStringArray('tags must be a stringArray')
  ctx.checkBody('openTimes').notEmpty('openTimes can not be null').isArray('openTimes must be an array')
  ctx.checkBody('uploadList').notEmpty('uploadList can not be null').isArray('uploadList must be an array')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const t = await sequelize.transaction()
  let restaurant = await ctx.models.Restaurant.findOne({where: {mapId: ctx.request.body.mapId}})
  if (restaurant) throw new APIError(400, ErrorsCategory[2], '改商户已经入住,请不要重复入住')
  try {
    // 转化一下openTimes
    const openTimes = ctx.request.body.openTimes.map(o => {
      return {
        info: o.info,
        time_range: o.timeRange.map(t => {
          return moment(t).valueOf()
        }).toString()
      }
    })
    // 找到城市
    const area = await ctx.models.RestaurantArea.findOne({
      where: {city: ctx.request.body.city}
    })
    // 创建restaurant
    restaurant = await ctx.models.Restaurant.create({
      mapId: ctx.request.body.mapId,
      name: ctx.request.body.name,
      icons: ctx.request.body.icons,
      intro: ctx.request.body.intro,
      cover: ctx.request.body.uploadList[0].url,
      unit_average: ctx.request.body.unit_average,
      tel: ctx.request.body.tel,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address,
      location_x: ctx.request.body.location_x,
      location_y: ctx.request.body.location_y,
      score: ctx.request.body.score, // 新增 score
      contract_time: moment(ctx.request.body.contract_time).valueOf(),
      restaurant_imgs: ctx.request.body.uploadList,
      restaurant_opentimes: openTimes,
      restaurant_area_id: area.id,
      restaurant_cuisine_id: ctx.request.body.restaurant_cuisine_id,
      restaurant_district_id: ctx.request.body.restaurant_district_id,
      restaurant_scene_id: ctx.request.body.scene_id === 0 ? null : ctx.request.body.scene_id,
      restaurant_other_id: ctx.request.body.other_id === 0 ? null : ctx.request.body.other_id
    }, {
      transaction: t,
      include: [{model: ctx.models.RestaurantImg}, {model: ctx.models.RestaurantOpentime}]
    })
    // 处理tags
    if (ctx.request.body.tags) {
      ctx.request.body.tags.forEach(async tag => {
        let t = await ctx.models.RestaurantTag.findOrCreate({
          where: {
            tag: tag
          }
        })
        await ctx.models.RestaurantToTag.create({
          restaurant_id: restaurant.id,
          restaurant_tag_id: t[0].id
        })
      })
    }
    await t.commit()
    ctx.rest(restaurant)
  } catch (err) {
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 更新一个商户信息，需要管理员权限
 */
export const PutOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('id').notEmpty('id can not be null').isInt('id must be a int').toInt()
  ctx.checkBody('mapId').notEmpty('mapId can not be null').isString('mapId must be a string')
  ctx.checkBody('city').notEmpty('city can not be null').isString('city must be a string')
  ctx.checkBody('restaurant_district_id').notEmpty('restaurant_district_id can not be null').isInt('restaurant_district_id must be a int')
  ctx.checkBody('restaurant_cuisine_id').notEmpty('restaurant_cuisine_id can not be null').isInt('restaurant_cuisine_id must be a int')
  ctx.checkBody('scene_id').notEmpty('scene_id can not be null').isInt('scene_id must be a int')
  ctx.checkBody('other_id').notEmpty('other_id can not be null').isInt('other_id must be a int')
  ctx.checkBody('name').notEmpty('name can not be null').isString('name must be a string')
  ctx.checkBody('icons').notEmpty('icons can not be null').isString('icons must be a string')
  ctx.checkBody('tel').notEmpty('tel can not be null').isString('tel must be a string')
  ctx.checkBody('intro').notEmpty('intro can not be null').isString('intro must be a string')
  ctx.checkBody('address').notEmpty('address can not be null').isString('address must be a string')
  ctx.checkBody('contract_time').notEmpty('contract_time can not be null').isString('contract_time must be a string')
  ctx.checkBody('unit_average').notEmpty('unit_average can not be null').isInt('unit_average must be a int').toInt()
  ctx.checkBody('location_x').notEmpty('location_x can not be null').isFloat('location_x must be a float').toFloat()
  ctx.checkBody('location_y').notEmpty('location_y can not be null').isFloat('location_y must be a float').toFloat()
  ctx.checkBody('score').notEmpty('score can not be null').isFloat('score must be a float').toFloat()  // 新增 score
  ctx.checkBody('tags').optional().isStringArray('tags must be a stringArray')
  ctx.checkBody('openTimes').notEmpty('openTimes can not be null').isArray('openTimes must be an array')
  ctx.checkBody('uploadList').notEmpty('uploadList can not be null').isArray('uploadList must be an array')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const t = await sequelize.transaction()
  let restaurant = await ctx.models.Restaurant.findById(ctx.request.body.id)
  if (!restaurant) throw new APIError(404, ErrorsCategory[4], '改商户不存在或者已经被删除')
  console.log('breakpoint!breakpoint!breakpoint!breakpoint!breakpoint!breakpoint111!')
  console.log(ctx.params)
  console.log('breakpoint!breakpoint!breakpoint!breakpoint!breakpoint!breakpoint222!')
   console.log(ctx.query)
   console.log('breakpoint!breakpoint!breakpoint!breakpoint!breakpoint!breakpoint!333')
   console.log(ctx.request.body)
  // 为了防止数据冗余 先删除旧的 imgs tags opentimes 在进行更新
  try {
    await ctx.models.RestaurantImg.destroy({
      where: {
        restaurant_id: restaurant.id
      },
      transaction: t     // 为所有数据库操作添加事物，其中一个失败，可以回滚之前的操作
    })
    await ctx.models.RestaurantToTag.destroy({
      where: {
        restaurant_id: restaurant.id
      },
      transaction: t
    })
    await ctx.models.RestaurantOpentime.destroy({
      where: {
        restaurant_id: restaurant.id
      },
      transaction: t
    })
    // 转换传递过来的参数
    const imgs = ctx.request.body.uploadList.map(u => {
      return {
        restaurant_id: restaurant.id,
        url: u.url,
        alt: u.alt,
        created_at: Date.now(),
        updated_at: Date.now(),
        version: 0
      }
    })
    const opentimes = ctx.request.body.openTimes.map(o => {
      return {
        restaurant_id: restaurant.id,
        info: o.info,
        time_range: o.timeRange.toString(),
        created_at: Date.now(),
        updated_at: Date.now(),
        version: 0
      }
    })
    // 新建餐廳img,tag,opentime
    await ctx.models.RestaurantImg.bulkCreate(imgs, {transaction: t})
    await ctx.models.RestaurantOpentime.bulkCreate(opentimes, {transaction: t})
    if (ctx.request.body.tags) {
      ctx.request.body.tags.forEach(async tag => {
        let t = await ctx.models.RestaurantTag.findOrCreate({
          where: {
            tag: tag
          }
        })
        await ctx.models.RestaurantToTag.create({
          restaurant_id: restaurant.id,
          restaurant_tag_id: t[0].id
        }, {
          transaction: t
        })
      })
    }
    // 找到城市
    const area = await ctx.models.RestaurantArea.findOne({
      where: {city: ctx.request.body.city}
    })
    restaurant = await restaurant.update({
      mapId: ctx.request.body.mapId,
      name: ctx.request.body.name,
      icons: ctx.request.body.icons,
      intro: ctx.request.body.intro,
      cover: ctx.request.body.uploadList[0].url,
      unit_average: ctx.request.body.unit_average,
      tel: ctx.request.body.tel,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address,
      location_x: ctx.request.body.location_x,
      location_y: ctx.request.body.location_y,
      score: ctx.request.body.score, // 新增 score
      contract_time: moment(ctx.request.body.contract_time).valueOf(),
      restaurant_area_id: area.id,
      restaurant_cuisine_id: ctx.request.body.restaurant_cuisine_id,
      restaurant_district_id: ctx.request.body.restaurant_district_id,
      restaurant_scene_id: ctx.request.body.scene_id === 0 ? null : ctx.request.body.scene_id,
      restaurant_other_id: ctx.request.body.other_id === 0 ? null : ctx.request.body.other_id
    }, {
      transaction: t
    })
    await t.commit()
    ctx.rest(restaurant)
  } catch (err) {
    t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 停止一个商户的服务
 */
export const StopOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be an int').toInt()
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let restaurant = await ctx.models.Restaurant.findById(ctx.params.id)
  if (!restaurant) throw new APIError(404, ErrorsCategory[4], '改商户不存在或者已经被删除')
  restaurant.status = '0'
  restaurant = await restaurant.save()
  ctx.rest(restaurant)
}
/**
 * 开启一个商户的服务
 */
export const StartOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be an int').toInt()
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let restaurant = await ctx.models.Restaurant.findById(ctx.params.id)
  if (!restaurant) throw new APIError(404, ErrorsCategory[4], '改商户不存在或者已经被删除')
  restaurant.status = '1'
  restaurant = await restaurant.save()
  ctx.rest(restaurant)
}
