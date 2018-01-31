import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取系统配置,需要管理员权限
 */
export const GetList = async (ctx, next) => {
  let system = await ctx.models.SystemConfig.findById(1)
  ctx.rest(system)
}
/**
 * 更新系统配置,需要管理员权限
 */
export const PutOne = async (ctx, next) => {
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  ctx.checkBody('ACTIVATION_expireIn').notEmpty('ACTIVATION_expireIn can not be null').isInt('ACTIVATION_expireIn must be a int').toInt()
  ctx.checkBody('JWT_expiresIn').notEmpty('JWT_expiresIn can not be null').isInt('JWT_expiresIn must be a int').toInt()
  ctx.checkBody('INVITE_money').notEmpty('INVITE_money can not be null').isInt('INVITE_money must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let system = await ctx.models.SystemConfig.findById(1)
  try {
    system = await system.update({
      ACTIVATION_expireIn: ctx.request.body.ACTIVATION_expireIn,
      JWT_expiresIn: ctx.request.body.JWT_expiresIn,
      INVITE_money: ctx.request.body.INVITE_money
    })
    ctx.rest(system)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
