import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取所有尊享卡列表
 */
export const GetList = async (ctx, next) => {
  try {
    let cards = await ctx.models.Card.findAll({
      include: [{
        model: ctx.models.CardTag,
        required: false,
        through: {
          model: ctx.models.CardToTag,
          attributes: ['id', 'card_id', 'tag_id', 'created_at', 'updated_at'],
          where: {
            deleted_at: null
          }
        }
      }, {
       model: ctx.models.RestaurantArea,
        required: false,
        through: {
          model: ctx.models.CardCity,
          where: {
            deleted_at: null
          }
        }
      }],
      order: [
        ['index', 'DESC'],
        ['id', 'DESC']
      ],
      where: {
        is_deleted: false,
        id: {
          $not: 16   // id=16 礼品卡不用显示到购买列表
        }
      }
    })
    ctx.rest(cards)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个尊享卡,需要管理员权限
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
  ctx.checkBody('price_unit').notEmpty('price_unit can not be null').isInt('price_unit must be a number').toInt()
  ctx.checkBody('name').notEmpty('name can not be null').isString('name must be a string')
  ctx.checkBody('expire_in').notEmpty('expire_in can not be null').isInt('expire_in muset be a number').toInt()
  ctx.checkBody('expire_time').notEmpty('expire_time can not be null').in(['hour', 'day', 'month', 'year'], 'expire_time must be one of hour day month year')
  ctx.checkBody('limit').notEmpty('limit can not be null').isInt('limit must be a number').toInt()
  ctx.checkBody('intro').notEmpty('intro can not be null').isString('intro must be a string')
  ctx.checkBody('tags').optional().isStringArray('tags must be a string array')
  ctx.checkBody('citys').notEmpty('citys can not be null').isIntArray('citys must be an int array')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])

  console.log(ctx.request.body)
  const t = await ctx.sequelize.transaction()
  try {
    let card = await ctx.models.Card.create({
      name: ctx.request.body.name,
      cover: ctx.request.body.cover,
      photos: ctx.request.body.photos,
      intro: ctx.request.body.intro,
      price_unit: ctx.request.body.price_unit,
      old_price: ctx.request.body.oldPrice,
      delivery: ctx.request.body.delivery,
      introduction: ctx.request.body.introduction,
      specification: ctx.request.body.specification,
      expire_in: ctx.request.body.expire_in,
      expire_time: ctx.request.body.expire_time,
      limit: ctx.request.body.limit,
      index: 0
    })
    if (ctx.request.body.tags) {
      ctx.request.body.tags.forEach(async tag => {
        let t = await ctx.models.CardTag.findOrCreate({
          where: {
            tag: tag
          }
        })
        await ctx.models.CardToTag.create({
          card_id: card.id,
          tag_id: t[0].id
        })
      })
    }
    // 根据传过来的citys 进行卡与城市的匹配
    ctx.request.body.citys.forEach(async c => {
      await ctx.models.CardCity.create({
        card_id: card.id,
        area_id: c
      })
    })
    await t.commit()
    ctx.rest(card)
  } catch (err) {
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个尊享卡,需要管理员权限
 * @param {id} 要更新的尊享卡ID
 * @param {price_unit} 要更新的尊享卡价格
 * @param {name} 要更新的尊享卡名称
 * @param {expire_in} 要更新的尊享卡失效时间
 * @param {expire_time} 要更新的尊享卡失效时间单位
 * @param {limit} 要更新的尊享卡使用限制
 * @param {intro} 要更新的尊享卡简介
 * @param {tags} Optional 尊享卡标签 字符串数组  如 ["高清", "超值"]
 */
export const PutOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  ctx.checkParams('index').optional().toInt()
  ctx.checkBody('price_unit').optional().isInt('price_unit must be a number').toInt()
  ctx.checkBody('name').optional().isString('name must be a string')
  ctx.checkBody('expire_in').optional().isInt('expire_in muset be a number').toInt()
  ctx.checkBody('expire_time').optional().in(['hour', 'day', 'month', 'year'], 'expire_time must be one of hour day month year')
  ctx.checkBody('limit').optional().isInt('limit must be a number').toInt()
  ctx.checkBody('intro').optional().isString('intro must be a string')
  ctx.checkBody('tags').optional().isStringArray()
  ctx.checkBody('citys').notEmpty('citys can not be null').isIntArray('citys must be an int array')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let card = await ctx.models.Card.findById(ctx.params.id)
  if (!card) throw new APIError(400, ErrorsCategory[4], '不存在的cardID')
  try {
    // 先删除原来卡与城市的匹配
    let areas = await ctx.models.CardCity.findAll({
      where: {
        card_id: card.id
      }
    })
    if (areas) {
      areas.forEach(async a => await a.destroy())
    }
    // 根据传过来的citys 进行卡与城市的匹配
    ctx.request.body.citys.forEach(async c => {
      await ctx.models.CardCity.create({
        card_id: card.id,
        area_id: c
      })
    })
    // 先删除tag_to_card表中的记录
    let results = await ctx.models.CardToTag.findAll({
      where: {
        card_id: card.id
      }
    })
    if (results) results.forEach(async r => await r.destroy())
    if (ctx.request.body.tags) {
      // 更新tags 重建card 与 tags之间的关系
      ctx.request.body.tags.forEach(async tag => {
        let t = await ctx.models.CardTag.findOrCreate({
          where: {
            tag: tag
          }
        })
        await ctx.models.CardToTag.create({
          card_id: card.id,
          tag_id: t[0].id
        })
      })
    }
    console.log(ctx.request.body)
    // 更新card
    if (ctx.request.body.name) card.name = ctx.request.body.name
    if (ctx.request.body.intro) card.intro = ctx.request.body.intro
    if (ctx.request.body.price_unit) card.price_unit = ctx.request.body.price_unit
    if (ctx.request.body.cover) card.cover = ctx.request.body.cover
    if (JSON.parse(ctx.request.body.photos).length) card.photos = ctx.request.body.photos
    if (ctx.request.body.oldPrice) card.old_price = ctx.request.body.oldPrice
    if (ctx.request.body.delivery) card.delivery = ctx.request.body.delivery
    if (ctx.request.body.introduction) card.introduction = ctx.request.body.introduction
    if (ctx.request.body.expire_in) card.expire_in = ctx.request.body.expire_in
    if (ctx.request.body.expire_time) card.expire_time = ctx.request.body.expire_time
    if (ctx.request.body.limit) card.limit = ctx.request.body.limit
    if (ctx.request.body.index) card.index = ctx.request.body.index

    // if (ctx.request.body.cover)
    // if (ctx.request.body.cover)

    card = await card.save({
      fields: ['name', 'cover', 'photos', 'price_unit', 'old_price', 'delivery', 'introduction', 'specification', 'expire_in', 'expire_time', 'limit', 'intro', 'index']
    })
    ctx.rest(card)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const DelectOne = async (ctx) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkParams('id').isInt('id must be an int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let card = await ctx.models.Card.findById(ctx.params.id)
  if (!card) throw new APIError(400, ErrorsCategory[4], '不存在的cardID')
  // 先删除tag_to_card表中的记录
  let results = await ctx.models.CardToTag.findAll({
    where: {
      card_id: card.id
    }
  })
  if (results) results.forEach(async r => await r.update({deleted_at: Date.now()}))
  card.deleted_at = Date.now()
  card.is_deleted = true
  card = await card.save()
  ctx.rest({id: card.id})
}
