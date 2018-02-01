import moment from 'moment'
import { ErrorsCategory } from '../config/index'
import { APIError } from '../middlewares/restify'
import { generateRandomAlphaNum, queryToSequelizeWhereSafely } from '../tool/Common'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 列出存在的激活码列表及状态 需要管理员权限
 * @param {*} ctx 是
 * @param {*} next 是
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.CardActivation)
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  try {
    let activations = await ctx.models.CardActivation.findAndCountAll(where)
    ctx.rest(activations)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}

export const GetOne = async (ctx, next) => {
  APIError
  return next()
}
/**
 * 创建1-n个激活码，需要管理员权限
 * @param {card_id} Number 激活码对应的尊享卡ID
 * @param {intro} String Optional 激活码说明
 * @param {n} Number 创建的激活码数量
 */
export const PostOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('card_id').notEmpty('card_id can not be null').isInt('card_id must be a number').toInt()
  ctx.checkBody('intro').optional().isString('intro must be a string')
  ctx.checkBody('n').optional().isInt('n must be a number').default(1)
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  // 验证 card_id 是否存在
  let card = await ctx.models.Card.findById(ctx.request.body.card_id)
  if (!card) throw new APIError(400, ErrorsCategory[2], 'card_id does not exit')
  try {
    // 逐个根据code 创建 防止 code重复
    const SystemCofig = await ctx.models.SystemConfig.findById(1)
    let activations = []
    for (let i = 0; i < ctx.request.body.n;) {
      const code = generateRandomAlphaNum(12)
      const acvPre = await ctx.models.CardActivation.findOne({ where: { code: code } })
      if (!acvPre) {
        // 尝试读取系统配置 激活码失效时间 如果不存在 使用默认值
        const expireTime = SystemCofig ? (SystemCofig.ACTIVATION_expireIn + Date.now()) : (60 * 60 * 24 * 100)
        // 创建激活码 并继续循环
        const acv = await ctx.models.CardActivation.create({
          code: code,
          expire_time: expireTime,
          card_id: ctx.request.body.card_id,
          admin_id: ctx.state.user.uuid,
          intro: ctx.request.body.intro
        })
        activations.push(acv)
        i++
        continue
      } else {
        // 继续循环
        continue
      }
    }
    ctx.rest(activations)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}

export const PutOne = async (ctx, next) => {
  console.log(ctx.request.body)
  ctx.checkBody('actCode').notEmpty('actCode can not be null').isString('actCode must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let activation = await ctx.models.CardActivation.findOne({ where: { code: ctx.request.body.actCode } })
  if (!activation) {
    throw new APIError(404, ErrorsCategory[4], '不存在的激活码id')
  } else if (activation.status.status !== '0') {
    throw new APIError(400, ErrorsCategory[2], '该激活码不可用')
  }
  // 激活码可用并且是自己的 开始执行使用逻辑
  const t = await ctx.sequelize.transaction()
  try {
    // 如果用户存在会员卡且可用，不存在则创建一张
    let card = await ctx.models.Card.findById(activation.card_id)
    // let vip = await ctx.models.UserVip.findOne({
    //   where: {
    //     user_id: ctx.state.user.uuid,
    //     status: '1'
    //   },
    //   order: 'id DESC'
    // })
    const vip = await ctx.models.UserVip.create({
      name: `${card.name}会员`,
      no: getOrderNumber(),
      start_time: Date.now(),
      total_money: card.price_unit,
      expire_time: moment().add(card.expire_in, `${card.expire_time}s`).valueOf(),
      status: '1',
      intro: '激活码兑换', // 好友赠送
      user_id: ctx.state.user.uuid,
      card_id: card.id
    })
    activation.status = '1'
    activation.actived_at = Date.now()
    activation = await activation.save()
    let vipInfo = {
      isVip: !(!vip || vip.status === '1'),
      name: vip ? vip.name : null,
      no: vip ? vip.no : null,
      start_time: vip ? vip.start_time : null,
      expire_time: vip ? vip.expire_time : null,
      status: vip ? vip.status : null,
      created_at: vip ? vip.created_at : null,
      updated_at: vip ? vip.updated_at : null
    }
    // 创建一个订单
    await ctx.models.Order.create({
      order_num: getOrderNumber(),
      total_fee: card.price_unit,
      should_fee: 0,
      actual_fee: 0,
      status: '1',
      type: '2',
      count: 1,
      card_id: card.id,
      user_id: ctx.state.user.uuid
    })
    await t.commit()
    ctx.rest(vipInfo)
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
  function getOrderNumber () {
    const orderNum = moment().format('YYYYMMDDmmssSSS')
    return orderNum
  }
}

export const DeleteOne = async (ctx, next) => {
  return next()
}
