import jwt from 'jsonwebtoken'
import md5 from 'md5'
import {System, ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'

export const entryVerify = async (ctx, next) => {
  return next()
}

export const signIn = async (ctx, next) => {
  // 执行登录逻辑
  ctx.checkBody('phone').notEmpty('phone can not be null').isInt('phone must be an int').toInt()
  ctx.checkBody('password').notEmpty('password can not be null').isString('password must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let admin = await ctx.models.UserAdmin.findOne({where: {phone: ctx.request.body.phone}})
  if (!admin) throw new APIError(400, ErrorsCategory[4], '不存在的用户')
  if (md5(ctx.request.body.password) !== admin.password) throw new APIError(400, ErrorsCategory[2], '用户密码不正确')
  const accessToken = jwt.sign({
    seed: Math.random(),
    uuid: admin.id,
    isAdmin: true,
    level: admin.level
  }, System.JWT_secret, {
    expiresIn: System.JWT_expiresIn
  })
  ctx.rest({
    ttl: System.JWT_expiresIn,
    created: Date.now(),
    token: `Bearer ${accessToken}`,
    admin_id: admin.id
  })
}
