import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely, getFlatternDistance, log} from '../tool/Common'
import {sequelize} from '../lib/sequelize'
Promise.promisifyAll(fs)

export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * date：2017-11-23
 * 获取系统所有开通的特色菜
 * description： 根据参数可以分页获取特色菜列表
 * 问题：每次请求到的数据可以按照一定的方式排序，但是首页多次请求后，整体数据的排序还是每页的排序，整体上排序是错误的
 * 解决：一次请求所以数据，比如per_page=30，在前端进行多次加载，因此亦可使用findAll()
 */
export const GetList = async (ctx, next) => {
  try {
    const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.Specialty, true)
    where['include'] = [{
      model: ctx.models.Restaurant,
      where: {
        status: '1'
      },
      include: [{
        model: ctx.models.RestaurantImg,
        required: false
      }, {
        model: ctx.models.RestaurantDistrict,
        required: false
      }, {
        model: ctx.models.RestaurantCuisine,
        required: false
      }, {
        model: ctx.models.RestaurantScene,
        required: false
      }]
    }, {
      model: ctx.models.SpecialtyImg,
      required: false,
      attributes: ['url']
    }]
    if (ctx.query.q) {
      where.include[0].where.name = {
        $like: `%${ctx.query.q}%`
      }
    }
    if (ctx.query.city_id) {
      where.include[0].where.restaurant_area_id = parseInt(ctx.query.city_id)
    }
    if (ctx.query.district_id) {
      where.include[0].where.restaurant_district_id = parseInt(ctx.query.district_id)
    }
    if (ctx.query.cuisine_id) {
      where.include[0].where.restaurant_cuisine_id = parseInt(ctx.query.cuisine_id)
    }
    if (ctx.query.scene_id) {
      where.include[0].where.restaurant_scene_id = parseInt(ctx.query.scene_id)
    }
    if (ctx.query.other_id) {
      where.include[0].where.restaurant_other_id = parseInt(ctx.query.other_id)
    }
    if (ctx.query.filter) {
      const filterObj = JSON.parse(ctx.query.filter)
      Object.keys(filterObj).map(k => {
        filterObj[k].$between = filterObj[k].$between.map(v => v * 100)
        where.include[0].where[k] = filterObj[k]
      })
    }
    if (ctx.query.orderby === 'updated_at') {   // ctx.query.orderby === 'created_at'
      const order = ctx.query.order ? ctx.query.order.toUpperCase() : 'DESC'
      where.order = [['updated_at', order]]
    }
    let specialtys = await ctx.models.Specialty.findAndCountAll(where)
    if (ctx.query.orderby === 'unit_average') {
      const order = ctx.query.order ? ctx.query.order.toUpperCase() : 'DESC'
      if (order === 'DESC') {
        specialtys.rows = specialtys.rows.sort((s, d) => s.restaurant.unit_average - d.restaurant.unit_average)
      } else {
        specialtys.rows = specialtys.rows.sort((s, d) => d.restaurant.unit_average - s.restaurant.unit_average)
      }
    }
    // 查找用户的收藏记录 并匹配
    // for (let i in ctx) {
    //   console.log(i)
    // }
    // console.log(ctx.state)
    if (Object.keys(ctx.state).length) {
      for (let i = 0; i < specialtys.rows.length; i++) {
        const like = await ctx.models.SpecialtyLiked.findOne({
          where: {
            user_id: ctx.state.user.uuid,
            specialty_id: specialtys.rows[i].id
          }
        })
        const collect = await ctx.models.SpecialtyCollected.findOne({
          where: {
            user_id: ctx.state.user.uuid,
            specialty_id: specialtys.rows[i].id
          }
        })
        const isCollected = collect ? 1 : 0
        const isLiked = like ? 1 : 0
        specialtys.rows[i].set('isCollected', isCollected, {
          raw: true
        })
        specialtys.rows[i].set('isLiked', isLiked, {
          raw: true
        })
        if (ctx.query.location) {
          const xy = ctx.query.location.split(',').map(l => parseFloat(l))
          let distance = getDistance(specialtys.rows[i].restaurant.location_y, specialtys.rows[i].restaurant.location_x, xy[1], xy[0])
          // let distance = getDistance(xy[0], xy[1], specialtys.rows[i].restaurant.location_x, specialtys.rows[i].restaurant.location_y)
          specialtys.rows[i].set('distance', distance, {
            raw: true
          })
        }
      }
    }
    if (ctx.query.orderby === 'location' && ctx.query.location) {
      const locationOrder = ctx.query.order ? ctx.query.order.toUpperCase() : 'DESC'
      if (locationOrder === 'DESC') {
        specialtys.rows = specialtys.rows.sort(function (s, d) {
          return s.get().distance - d.get().distance
        })
      } else {
        specialtys.rows = specialtys.rows.sort(function (s, d) {
          return d.get().distance - s.get().distance
        })
      }
    }
		ctx.rest(specialtys)
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个特色菜
 * @param {cook_avatar} String 1
 * @param {cook_intro} String 1
 * @param {cook_name} String 1
 * @param {cook_super} Boolean
 * @param {expire_time} Number 1
 * @param {intro} Sring Optional 1
 * @param {content_markdown_url} Sring 1
 * @param {rule_markdown_url} String 1
 * @param {shika_markdown_url} String 1
 * @param {shitan_markdown_url} String 1
 * @param {name} String 1
 * @param {rebate} Float 1
 * @param {type} String 1
 * @param {value} Number 1
 * @param {restaurant_id} Number 1
 */
export const PostOne = async (ctx) => {
  console.log(ctx.state.user)
  // if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('cook_avatar').notEmpty('cook_avatar cannot be null').isString('cook_avatar must be a string')
  ctx.checkBody('cook_intro').notEmpty('cook_intro cannot be null').isString('cook_intro must be a string')
  ctx.checkBody('cook_name').notEmpty('cook_name cannot be null').isString('cook_name must be a string')
  ctx.checkBody('intro').optional().isString('intro must be a string')
  ctx.checkBody('cover').notEmpty('cover cannot be null').isString('cover must be a string')
  ctx.checkBody('content_markdown_url').notEmpty('content_markdown_url cannot be null').isString('content_markdown_url must be a string')
  ctx.checkBody('rule_markdown_url').notEmpty('rule_markdown_url cannot be null').isString('rule_markdown_url must be a string')
  ctx.checkBody('name').notEmpty('name cannot be null').isString('name must be a string')
  ctx.checkBody('type').notEmpty('type cannot be null').isString('type must be a string')
  ctx.checkBody('value').notEmpty('value cannot be null').isInt('value must be a int').toInt()
  ctx.checkBody('restaurant_id').notEmpty('restaurant_id cannot be null').isInt('restaurant_id must be a int').toInt()
  ctx.checkBody('expire_time').notEmpty('expire_time cannot be null').isInt('expire_time must be a int').toInt()
  ctx.checkBody('cook_super').notEmpty('cook_super cannot be null').toBoolean()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const restaurant = await ctx.models.Restaurant.findById(ctx.request.body.restaurant_id)
  if (!restaurant) throw new APIError(404, ErrorsCategory[4], '不存在的商户')
  let specialty = await ctx.models.Specialty.scope('detail').findOne({
    where: {
      restaurant_id: ctx.request.body.restaurant_id
    }
  })
  if (specialty) throw new APIError(400, ErrorsCategory[3], '已经有特色菜了')

  const t = await sequelize.transaction()  // 创建事物 2017-11-16

  try {
    // const content = new Buffer(ctx.request.body.content_markdown_url)
    // const rule = new Buffer(ctx.request.body.rule_markdown_url)
    // const contentUrl = `html/${ctx.request.body.restaurant_id}_${Date.now()}_content.html`
    // const ruleUrl = `html/${ctx.request.body.restaurant_id}_${Date.now()}_rule.html`
    // await fs.writeFile(path.resolve(__dirname, `../../assets/${contentUrl}`), content)
    // await fs.writeFile(path.resolve(__dirname, `../../assets/${ruleUrl}`), rule)

    // 把提交过来的数据转换格式
    const imgs = ctx.request.body.specialty_imgs.map(item => {
      return {
        url: item.dataUrl,
        alt: item.alt,
        created_at: Date.now(),
        updated_at: Date.now(),
        version: 0
      }
    })

    const specialty = await ctx.models.Specialty.create({
      cook_avatar: ctx.request.body.cook_avatar,
      cook_intro: ctx.request.body.cook_intro,
      cook_name: ctx.request.body.cook_name,
      intro: ctx.request.body.intro,
      cover: ctx.request.body.cover,
      content_markdown_url: ctx.request.body.content_markdown_url,
      rule_markdown_url: ctx.request.body.rule_markdown_url,
      shika_markdown_url: ctx.request.body.shika_markdown_url,
      shitan_markdown_url: ctx.request.body.shitan_markdown_url,
      name: ctx.request.body.name,
      type: ctx.request.body.type,
      value: ctx.request.body.value,
      restaurant_id: ctx.request.body.restaurant_id,
      expire_time: ctx.request.body.expire_time,
      cook_super: ctx.request.body.cook_super,
      recommend_id: ctx.request.body.recommend_id || '',  // 新增推荐餐厅
      specialty_imgs: imgs
    }, {
      transaction: t,
      include: [{model: ctx.models.SpecialtyImg}]
    })
    await t.commit()
    ctx.rest(specialty)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}

export const GetOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  let specialty
  try {
    specialty = await ctx.models.Specialty.scope('detail').findById(ctx.params.id
      , {
      include: [{
        model: ctx.models.Restaurant,
        include: [{
          model: ctx.models.RestaurantImg
        }, {
        model: ctx.models.RestaurantDistrict,
        required: false
        }, {
          model: ctx.models.RestaurantCuisine,
          required: false
        }, {
          model: ctx.models.RestaurantScene,
          required: false
        }]
      }, {
        model: ctx.models.SpecialtyImg,
        required: false
      }]
    }
    )
  } catch (err) {
    console.log('===============can not get query from database!!!' + specialty)
    throw new APIError(500, ErrorsCategory[4], err.message)
  }
  // console.log('===============' + specialty)
  if (!specialty) throw new APIError(404, ErrorsCategory[4], '找不到菜系信息')
  if (ctx.query.location) {
    const location = ctx.query.location.split(',').map(l => {
      return parseFloat(l)
    })
    const distance = getFlatternDistance(location[0], location[1], specialty.restaurant.location_x, specialty.restaurant.location_y) ? getFlatternDistance(location[0], location[1], specialty.restaurant.location_x, specialty.restaurant.location_y) : 0
    specialty.set('distance', distance, {
      raw: true
    })
  }
  ctx.rest(specialty)
}
export const GetCookTop11 = async (ctx, next) => {  // 获取Top11厨师点赞排行榜数据
  try {
    const top11 = await ctx.models.Specialty.findAll({
      attributes: ['id', 'cook_name', 'cook_avatar', [sequelize.fn('COUNT', sequelize.col('cook_liked')), 'likedCount']],
      group: 'cook_name',
      order: 'cook_liked',
      include: [{
        model: ctx.models.Restaurant,
        attributes: ['name', 'cover', 'unit_average', 'score'],
        include: {
          model: ctx.models.RestaurantCuisine
        }
      }],
      limit: 11
    })
    if (!top11) {
      ctx.throw(404, '参数错误 | 查找不到数据')
    }
    console.log('===========success==========')
    console.log(top11)
    ctx.rest(top11)
  } catch (err) {
    console.log('=========error:=========' + err.message)
    ctx.throw(400, err.message)
  }
}

export const PutOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  // ctx.checkBody('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  ctx.checkBody('cook_avatar').notEmpty('cook_avatar cannot be null').isString('cook_avatar must be a string')
  ctx.checkBody('cover').notEmpty('cover cannot be null').isString('cover must be a string')
  ctx.checkBody('cook_intro').notEmpty('cook_intro cannot be null').isString('cook_intro must be a string')
  ctx.checkBody('cook_name').notEmpty('cook_name cannot be null').isString('cook_name must be a string')
  ctx.checkBody('intro').optional().isString('intro must be a string')
  ctx.checkBody('content_markdown_url').notEmpty('content_markdown_url cannot be null').isString('content_markdown_url must be a string')
  ctx.checkBody('rule_markdown_url').notEmpty('rule_markdown_url cannot be null').isString('rule_markdown_url must be a string')
  ctx.checkBody('name').notEmpty('name cannot be null').isString('name must be a string')
  ctx.checkBody('type').notEmpty('type cannot be null').isString('type must be a string')
  ctx.checkBody('value').notEmpty('value cannot be null').isInt('value must be a int').toInt()
  ctx.checkBody('restaurant_id').notEmpty('restaurant_id cannot be null').isInt('restaurant_id must be a int').toInt()
  ctx.checkBody('expire_time').notEmpty('expire_time cannot be null').isInt('expire_time must be a int').toInt()
  ctx.checkBody('cook_super').notEmpty('cook_super cannot be null').toBoolean()

  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  const t = await sequelize.transaction()  // 创建事物 2017-11-16
  let specialty = await ctx.models.Specialty.scope('detail').findById(ctx.params.id)
  if (!specialty) throw new APIError(404, ErrorsCategory[4], '找不到菜系信息')
  try {
    // const content = new Buffer(ctx.request.body.content_markdown_url)
    // const rule = new Buffer(ctx.request.body.rule_markdown_url)
    // const contentUrl = `html/${ctx.request.body.restaurant_id}_${Date.now()}_content.html`
    // const ruleUrl = `html/${ctx.request.body.restaurant_id}_${Date.now()}_rule.html`
    // await fs.writeFile(path.resolve(__dirname, `../../assets/${contentUrl}`), content)
    // await fs.writeFile(path.resolve(__dirname, `../../assets/${ruleUrl}`), rule)

    // 先删除specailty_img里的特色菜图片
    await ctx.models.SpecialtyImg.destroy({
    where: {
      specialty_id: ctx.params.id
    },
    transaction: t // 为所有数据库操作添加事物，其中一个失败，可以回滚之前的操作
    })
    // 把提交过来的数据转换格式
    const imgs = ctx.request.body.specialty_imgs.map(item => {
      return {
        specialty_id: ctx.params.id,
        url: item.dataUrl,
        alt: item.alt || '特色菜封面',
        created_at: Date.now(),
        updated_at: Date.now(),
        version: 0
      }
    })
    await ctx.models.SpecialtyImg.bulkCreate(imgs, {transaction: t})
    console.log(ctx.request.body)
    specialty = await specialty.update({
      cook_avatar: ctx.request.body.cook_avatar,
      cook_intro: ctx.request.body.cook_intro,
      cook_name: ctx.request.body.cook_name,
      intro: ctx.request.body.intro,
      cover: ctx.request.body.cover,
      content_markdown_url: ctx.request.body.content_markdown_url,
      rule_markdown_url: ctx.request.body.rule_markdown_url,
      shika_markdown_url: ctx.request.body.shika_markdown_url,
      shitan_markdown_url: ctx.request.body.shitan_markdown_url,
      name: ctx.request.body.name,
      type: ctx.request.body.type,
      value: ctx.request.body.value,
      restaurant_id: ctx.request.body.restaurant_id,
      expire_time: ctx.request.body.expire_time,
      cook_super: ctx.request.body.cook_super,
      updated_at: Date.now(),  // new Date().getTime()
      recommend_id: ctx.request.body.recommend_id || ''  // 新增推荐餐厅
    }, {
      transaction: t // 为所有数据库操作添加事物，其中一个失败，可以回滚之前的操作
    })
    await t.commit()
    ctx.rest(specialty)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PutLike = async (ctx, next) => {
  // console.log('dddddddddddddddddddddddddddd')
  ctx.checkBody('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  // ctx.checkBody('liked').notEmpty('liked cannot be null').isInt('liked must be a number').toInt()
  let specialty = await ctx.models.Specialty.findById(ctx.request.body.id)
  try {
    specialty = await specialty.update({
      cook_liked: ctx.request.body.liked
    })
    ctx.rest(specialty)
  } catch (err) {
    console.log('dddddddddddddddddddddddddddd')
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const DeleteOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  let specialty = await ctx.models.Specialty.findById(ctx.params.id)
  if (!specialty) throw new APIError(404, ErrorsCategory[4], '找不到菜系信息')
  try {
    specialty = await specialty.destroy()
    ctx.rest(specialty)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
function toRad (d) {
  return (d * Math.PI) / 180
}
function getDistance (lat1, lng1, lat2, lng2) {
  const radLat1 = toRad(lat1)
  const radLat2 = toRad(lat2)
  const deltaLat = radLat1 - radLat2
  const deltaLng = toRad(lng1) - toRad(lng2)
  return (2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + (Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2))))) * 6378137
}
