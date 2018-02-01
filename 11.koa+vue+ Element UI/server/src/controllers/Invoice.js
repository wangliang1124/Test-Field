import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'
const moment = require('moment')
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取系统开发票的列表
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.Invoice)
  if (!ctx.state.user.isAdmin) {
    if (!where.where) {
      where.where = {}
    }
    where.where.user_id = ctx.state.user.uuid
  }
  where['include'] = [{
    model: ctx.models.User,
    require: false
  }]
  try {
    const invoices = await ctx.models.Invoice.findAll()
    ctx.rest(invoices)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 创建一个发票申请
 */
export const PostOne = async (ctx) => {
  console.log(ctx.request.body)
  ctx.checkBody('title').notEmpty('title can not be null').isString('title must be a string')
  ctx.checkBody('type').notEmpty('type can not be null').in(['0', '1'], 'type must in 0 and 1')
  ctx.checkBody('content').optional().isString('content must be a string')
  ctx.checkBody('intro').optional().isString('intro must be a string')
  console.log(ctx.body)
  if (ctx.errors) {
    console.log(ctx.errors)
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  try {
    let invoice
    let order
    let orderGroup
    if (ctx.request.body.tab === 0) {
      order = await ctx.models.Order.findById(ctx.request.body.order_id)
      if (!order) throw new APIError(404, ErrorsCategory[4], 'cannot find the order')
      invoice = await ctx.models.Invoice.findOne({
        where: {
          order_id: ctx.request.body.order_id,
          status: {
            $in: ['0', '1']
          }
        }
      })
    } else {
      orderGroup = await ctx.models.OrderGroup.findById(ctx.request.body.order_group_id)
      if (!orderGroup) throw new APIError(404, ErrorsCategory[4], 'cannot find the ordergroup')
      invoice = await ctx.models.Invoice.findOne({
        where: {
          order_group_id: ctx.request.body.order_group_id,
          status: {
            $in: ['0', '1']
          }
        }
      })
    }
    if (invoice) throw new APIError(400, ErrorsCategory[2], '已经申请过发票了')
    invoice = await ctx.models.Invoice.create({
      no: getOrderNumber(),
      title: ctx.request.body.title,
      money: order ? order.actual_fee : orderGroup.actual_fee,
      content: ctx.request.body.content,
      tax_code: ctx.request.body.tax_code,
      type: ctx.request.body.type,
      status: '0',
      user_id: ctx.state.user.uuid,
      intro: ctx.request.body.intro,
      order_id: ctx.request.body.order_id,
      order_group_id: ctx.request.body.order_group_id
    })
    ctx.rest(invoice)
  } catch (err) {
    console.log(err)
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
// 更新一个发票申请
export const PutOne = async (ctx) => {
}
function getOrderNumber () {
  const orderNum = moment().format('YYYYMMDDmmssSSS')
  return orderNum
}
