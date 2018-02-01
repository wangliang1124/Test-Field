import moment from 'moment'
import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import Redis from 'ioredis'
import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
const Payment = require('wechat-pay').Payment
var initConfig = {
  partnerKey: 'ysjysjysjysjysjysjysjysjysjysj12',
  appId: 'wxfc34b0cedd6ce73f',
  mchId: '1335827501',
  notifyUrl: 'http://ysj.tcfellow.com:3000/api/v1/wx/pay',
  pfx: fs.readFileSync(path.resolve(__dirname, '../../cert/apiclient_cert.p12'))
}
const redis = new Redis(6379, '127.0.0.1')
const payment = new Payment(initConfig)
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取订单列表，管理员获取全部，用户获取自己的
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.Order)
  if (!ctx.state.user.isAdmin) {
    if (!where.where) {
      where.where = {}
    }
    where.where.user_id = ctx.state.user.uuid
  }
  where['include'] = [{
    model: ctx.models.User,
    required: false
  }, {
    model: ctx.models.Card,
    required: false
  }, {
    model: ctx.models.Invoice,
    required: false,
    order: 'id desc'
  }]
  try {
    const orders = await ctx.models.Order.findAndCountAll(where)
    ctx.rest(orders)
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 获取订单列表，管理员获取全部，用户获取自己的
 */
export const GetGroupList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.OrderGroup)
  if (!ctx.state.user.isAdmin) {
    if (!where.where) {
      where.where = {}
    }
    where.where.user_id = ctx.state.user.uuid
  }
  where['include'] = [{
    model: ctx.models.User,
    required: false
  }, {
    model: ctx.models.Card,
    required: false
  }, {
    model: ctx.models.Invoice,
    required: false,
    order: 'id desc'
  }]
  try {
    const orders = await ctx.models.OrderGroup.findAndCountAll(where)
    ctx.rest(orders)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个订单
 * @param {card_id} 购买的会员卡id
 * @param {count} 购买的数量
 */
export const PostOne = async (ctx) => {
  ctx.checkBody('card_id').notEmpty('card_id cannot be null').isInt('card_id must be a int').toInt()
  ctx.checkBody('count').notEmpty('count cannot be null').isInt('count must be an int').toInt()
  ctx.checkBody('coupon_id').optional().isInt('coupon_id must be a int').toInt()
  ctx.checkBody('coupon_restaurant_id').optional().isInt('coupon_restaurant_id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const card = await ctx.models.Card.findById(ctx.request.body.card_id)
  if (!card) throw new APIError(404, ErrorsCategory[4], '不存在的card_id')
  if (ctx.request.body.coupon_id && ctx.request.body.coupon_restaurant_id) {
    throw new APIError(400, ErrorsCategory[2], '优惠券只能使用一张')
  }
  const t = await ctx.sequelize.transaction()
  try {
    let couponId = null
    let couponRestaurantId = null
    let totalFee = parseInt(card.price_unit * ctx.request.body.count)
    let shouldFee = parseInt(card.price_unit * ctx.request.body.count)
    if (ctx.request.body.coupon_id) {
      const coupon = await ctx.models.Coupon.findById(ctx.request.body.coupon_id)
      if (coupon && coupon.status.status === '1') {
        shouldFee -= coupon.value
        couponId = coupon.id
        coupon.status = '0'
        await coupon.save()
      }
    }
    if (ctx.request.body.coupon_restaurant_id) {
      const couponRestaurant = await ctx.models.CouponRestaurant.findById(ctx.request.body.coupon_restaurant_id)
      if (couponRestaurant && couponRestaurant.status.status === '1') {
        shouldFee -= couponRestaurant.value
        couponRestaurantId = couponRestaurant.id
        couponRestaurant.status = '0'
        await couponRestaurant.save()
      }
    }
    const order = await ctx.models.Order.create({
      card_id: ctx.request.body.card_id,
      user_id: ctx.state.user.uuid,
      order_num: getOrderNumber(),
      total_fee: parseInt(totalFee),
      should_fee: parseInt(shouldFee),
      type: '1',
      status: '0',
      count: ctx.request.body.count,
      coupon_id: couponId,
      coupon_restaurant_id: couponRestaurantId,
      user_name: ctx.request.body.userName,
      tel_number: ctx.request.body.telNumber,
      national_code: ctx.request.body.nationalCode,
      postal_code: ctx.request.body.postalCode,
      province_name: ctx.request.body.provinceName,
      city_name: ctx.request.body.cityName,
      country_name: ctx.request.body.countryName,
      detail_info: ctx.request.body.detailInfo
    })
    let expireTime = ''
    switch (card.expire_time) {
      case 'day':
        expireTime = '天'
        break
      case 'month':
        expireTime = '月'
        break
      case 'year':
        expireTime = '年'
        break
      default:
        expireTime = '天'
        break
    }
    const user = await ctx.models.User.findById(ctx.state.user.uuid)
    let ip = ''
    if (ctx.ip.startsWith('::ffff:')) {
      ip = ctx.ip.substring(7)
    } else {
      ip = ctx.ip
    }
    const orderPre = {
      body: '玥享卡会员购买',
      attach: `玥享卡使用期限:${card.name}*${card.expire_in}${expireTime}`,
      out_trade_no: order.order_num,
      total_fee: order.should_fee * 100,
      spbill_create_ip: ip,
      openid: user.wx_openid,
      trade_type: 'JSAPI'
    }
    // 微信预付款订单
    const payargs = await promiseGetBrandWCPayRequestParams(orderPre)
    await t.commit()
    ctx.rest({payargs: payargs, order_id: order.id})
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个团购订单
 * @param {card_id} 购买的会员卡id
 * @param {count} 购买的数量
 * @param {payway}
 */
export const GroupOne = async (ctx) => {
  ctx.checkBody('card_id').notEmpty('card_id cannot be null').isInt('card_id must be a int').toInt()
  ctx.checkBody('count').notEmpty('count cannot be null').isInt('count must be an int').toInt()
  ctx.checkBody('payway').notEmpty('payway can not be null').isString('payway must be a string').in(['pay1', 'pay2'], 'payway must in pay1 or pay2')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const card = await ctx.models.Card.findById(ctx.request.body.card_id)
  if (!card) throw new APIError(404, ErrorsCategory[4], '不存在的card_id')
  const t = await ctx.sequelize.transaction()
  try {
    let totalFee = parseInt(card.price_unit * ctx.request.body.count)
    let shouldFee = parseInt(card.price_unit * ctx.request.body.count)
    const order = await ctx.models.OrderGroup.create({
      card_id: ctx.request.body.card_id,
      user_id: ctx.state.user.uuid,
      order_num: getOrderNumber(),
      total_fee: parseInt(totalFee),
      should_fee: parseInt(shouldFee),
      type: ctx.request.body.payway === 'pay1' ? '1' : '2',
      status: '0',
      count: ctx.request.body.count,
      user_name: ctx.request.body.userName,
      tel_number: ctx.request.body.telNumber,
      national_code: ctx.request.body.nationalCode,
      postal_code: ctx.request.body.postalCode,
      province_name: ctx.request.body.provinceName,
      city_name: ctx.request.body.cityName,
      country_name: ctx.request.body.countryName,
      detail_info: ctx.request.body.detailInfo
    })
    let expireTime = ''
    switch (card.expire_time) {
      case 'day':
        expireTime = '天'
        break
      case 'month':
        expireTime = '月'
        break
      case 'year':
        expireTime = '年'
        break
      default:
        expireTime = '天'
        break
    }
    const user = await ctx.models.User.findById(ctx.state.user.uuid)
    let ip = ''
    if (ctx.ip.startsWith('::ffff:')) {
      ip = ctx.ip.substring(7)
    } else {
      ip = ctx.ip
    }
    if (ctx.request.body.payway === 'pay1') {
      const orderPre = {
        body: '玥享卡会员购买',
        attach: `玥享卡使用期限:${card.name}*${card.expire_in}${expireTime}`,
        out_trade_no: order.order_num,
        total_fee: order.should_fee * 100,
        spbill_create_ip: ip,
        openid: user.wx_openid,
        trade_type: 'JSAPI'
      }
      // 微信预付款订单
      const payargs = await promiseGetBrandWCPayRequestParams(orderPre)
      console.log(payargs)
      await t.commit()
      ctx.rest({payargs: payargs, order_id: order.id})
    } else {
      await t.commit()
      ctx.rest(order)
    }
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PayGroupOne = async (ctx, next) => {
  const orderNo = ctx.request.body.order_id
  const t = await ctx.sequelize.transaction()
  try {
    let order = await ctx.models.OrderGroup.findById(orderNo)
    order.status = '1'
    order.type = '1'
    order.actual_fee = order.should_fee
    order = await order.save()
    await t.commit()
    ctx.rest(order)
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PayOne = async (ctx, next) => {
  const orderNo = ctx.request.body.order_id
  const t = await ctx.sequelize.transaction()
  try {
    let order = await ctx.models.Order.findById(orderNo)
    let card = await ctx.models.Card.findById(order.card_id)
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
      intro: '微信支付购买',
      user_id: ctx.state.user.uuid,
      card_id: card.id
    })
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
    order.status = '1'
    order.type = '1'
    order.actual_fee = order.should_fee
    order = await order.save()
    card.total_sold += order.count
    await card.save()
    await t.commit()
    let year = moment().year()
    let day = moment().dayOfYear()
    let loginKey = `pay:${year}-${day}`
    let now = Math.floor(Date.now() / 1000)
    await redis.zadd(loginKey, now, ctx.state.user.uuid)
    ctx.rest(vipInfo)
  } catch (err) {
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const GoodItemOrder = async (ctx) => {
  console.log('==================创建精选产品订单=================')
  console.log(ctx.request.body)
  ctx.checkBody('goods').notEmpty('goods cannot be null')
  ctx.checkBody('payway').notEmpty('payway can not be null').isString('payway must be a string').in(['pay1', 'pay2'], 'payway must in pay1 or pay2')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])

  const t = await ctx.sequelize.transaction()
  try {
    const createOrders = []
    const goods = ctx.request.body.goods
    let orderNum = getOrderNumber() // 同一批购买，同一个订单号
    for (let i = 0; i < ctx.request.body.goods.length; i++) {
      const card = await ctx.models.Card.findById(goods[i].id)
      let order
      if (!card) { throw new APIError(404, ErrorsCategory[4], '不存在的card_id') }
      order = ctx.models.OrderGroup.create({
        card_id: goods[i].id,
        total_fee: card.price_unit * goods[i].count,
        should_fee: card.price_unit * goods[i].count,
        count: goods[i].count,
        user_id: ctx.state.user.uuid,
        order_num: orderNum,
        type: ctx.request.body.payway === 'pay1' ? '1' : '2',
        status: '0',
        user_name: ctx.request.body.userName,
        tel_number: ctx.request.body.telNumber,
        national_code: ctx.request.body.nationalCode,
        postal_code: ctx.request.body.postalCode,
        province_name: ctx.request.body.provinceName,
        city_name: ctx.request.body.cityName,
        country_name: ctx.request.body.countryName,
        detail_info: ctx.request.body.detailInfo
      }, { transaction: t })
      createOrders.push(order)
    }
    let result = await Promise.all(createOrders)

    let totalFee = 0
    let orderID = []
    for (let i in result) {
      if (result.hasOwnProperty(i)) {
        totalFee += result[i].total_fee
        orderID.push(result[i].id)
      }
    }
    // totalFee = Object.values(result).forEach((item) => { totalFee += item.total_fee })
    // console.log(totalFee)

    const user = await ctx.models.User.findById(ctx.state.user.uuid)
    let ip = ''
    if (ctx.ip.startsWith('::ffff:')) {
      ip = ctx.ip.substring(7)
    } else {
      ip = ctx.ip
    }
    if (ctx.request.body.payway === 'pay1') {
      const orderPre = {
        body: '玥食记-精选优品',
        attach: '玥享卡平台',
        out_trade_no: orderNum,   // Date.now(),
        total_fee: totalFee * 100,  // totalFee * 100 单位为分，因此*100
        spbill_create_ip: ip,
        openid: user.wx_openid,
        trade_type: 'JSAPI'
      }
      // 微信预付款订单
      const payargs = await promiseGetBrandWCPayRequestParams(orderPre)
      await t.commit()
      ctx.rest({payargs: payargs, orderID: orderID})
      console.log('===========create goods order success pay1==========')
    } else {
      await t.commit()
      ctx.rest(result)
      console.log('===========create goods order success pay2==========')
    }
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PayGoodItem = async(ctx, next) => {
  console.log(ctx.request.body.orderID)
  ctx.checkBody('orderID').notEmpty('orderID cannot be null')
  const t = await ctx.sequelize.transaction()
  try {
    const orderID = ctx.request.body.orderID
    const payOrders = []
    for (let i = 0; i < orderID.length; i += 1) {
      let order = await ctx.models.OrderGroup.findById(orderID[i])
      if (!order) { throw new APIError(404, ErrorsCategory[4], '不存在的order_id') }
      order.status = '1'
      order.type = '1'
      order.actual_fee = order.should_fee
      order = order.save({ transaction: t })
      payOrders.push(order)
    }
    let result = await Promise.all(payOrders)
    console.log(result)
    ctx.rest(result)
  } catch (err) {
    console.log(err)
    await t.rollback()
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
export const PutOneGroup = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let order = await ctx.models.OrderGroup.findById(ctx.params.id)
  if (!order) throw new APIError(404, ErrorsCategory[4], '不存在的card_id')
  let card = await ctx.models.Card.findById(order.card_id)
  try {
    order.status = '1'
    order.type = '2'
    order.actual_fee = order.should_fee
    order = await order.save()
    card.total_sold += order.count
    await card.save()
    let year = moment().year()
    let day = moment().dayOfYear()
    let loginKey = `pay:${year}-${day}`
    let now = Math.floor(Date.now() / 1000)
    await redis.zadd(loginKey, now, order.user_id)
    ctx.rest(order)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
function getOrderNumber () {
  const orderNum = moment().format('YYYYMMDDmmssSSS')
  return orderNum
}
function promiseGetBrandWCPayRequestParams (order) {
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
      if (err) {
        reject(err)
      }
      resolve(payargs)
    })
  })
}

export const OrderReserve = async (ctx, next) => {
  ctx.checkBody('restaurant_id').notEmpty('restaurant_id cannot be null').isInt('restaurant_id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  const restaurant = await ctx.models.Restaurant.findById(ctx.request.body.restaurant_id)
  if (!restaurant) throw new APIError(404, ErrorsCategory[4], '不存在的餐厅id')

  try {
    const reserve = ctx.request.body.reserve
    const order = await ctx.models.OrderReserve.create({
      order_id: reserve.orderId,
      restaurant_id: reserve.restaurantId,
      dining_date: reserve.diningDate,
      count: reserve.count,
      room: reserve.room,
      user_id: reserve.userId,
      user_name: reserve.userName,
      tel: reserve.tel,
      status: reserve.status,
      remark: reserve.remark
    })
  } catch (err) {
    console.log(err.message)
  }
}
