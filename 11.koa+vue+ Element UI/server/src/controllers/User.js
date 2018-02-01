import jwt from 'jsonwebtoken'
import OAuth from 'wechat-oauth'
import ChinaAreaData from 'china-area-data'
import moment from 'moment'
import Promise from 'bluebird'
import md5 from 'md5'
import Redis from 'ioredis'
import {System, ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
import {queryToSequelizeWhereSafely} from '../tool/Common'

const redis = new Redis(6379, '127.0.0.1')
Promise.promisifyAll(OAuth.prototype)
const wxClient = new OAuth(System.pubWxAppId, System.pubWxAppSecret)

export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取用户列表，需要管理员权限
 */
export const GetList = async (ctx, next) => {
  const where = await queryToSequelizeWhereSafely(ctx.query, ctx.models.User)
  if (!ctx.state.user.isAdmin) throw new APIError(400, ErrorsCategory[1], '需要管理员权限')
  try {
    where.include = [{
      model: ctx.models.UserVip,
      required: false,
      where: {
        status: '1'
      }
    }]
    let users = await ctx.models.User.findAndCountAll(where)
    ctx.rest(users)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
/**
 * 根据id获取用户相关信息 需要登录
 * @param {id} ctx 用户的id
 */
export const GetOne = async (ctx, next) => {
  ctx.checkParams('id').notEmpty('id cannot be null').isInt('id must be a number').toInt()
  if (ctx.errors) {
    throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  }
  try {
    // 获取用户信息
    let user = await ctx.models.User.findById(ctx.params.id)
    if (!user) throw new APIError(404, ErrorsCategory[4], '找不到用户')
    // 获取用户的会员卡信息
    let userVip = await ctx.models.UserVip.findOne({
      where: {
        user_id: user.id
      },
      order: 'created_at DESC'
    })
    let vip = {
      isVip: !(!userVip || userVip.status === '1'),
      name: userVip ? userVip.name : null,
      no: userVip ? userVip.no : null,
      start_time: userVip ? userVip.start_time : null,
      expire_time: userVip ? userVip.expire_time : null,
      status: userVip ? userVip.status : null,
      created_at: userVip ? userVip.created_at : null,
      updated_at: userVip ? userVip.updated_at : null
    }
    ctx.rest({
      user_info: user,
      user_vip: vip
    })
  } catch (err) {
    throw new APIError(400, ErrorsCategory[4], err.message)
  }
}
/**
 * 用户使用微信登录,用户标识为wx_openid,登录与注册写在了一个接口里，若用户未注册则先注册再登录
 * @param {wx_openid} String 微信的openid
 * @param {nickname} String  用户昵称
 * @param {avatar} String 用户头像
 * @param {sex} String 用户性别
 * @param {province} String 用户省份
 * @param {city} String 用户城市
 * @param {country} String 用户国家
 */
export const signIn = async (ctx, next) => {
  ctx.checkBody('code').notEmpty('code cannot be null').isString('code must be a string')
  ctx.checkBody('inviter_id').optional().isInt('inviter_id must be a int').toInt()
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  let wxUser
  try {
    wxUser = await wxClient.getUserByCodeAsync(ctx.request.body.code)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[3], 'code has benn used')
  }
  let user = await ctx.models.User.findOne({where: {wx_openid: wxUser.openid}})
  // let user = await ctx.models.User.findById(1)
  if (!user) {
    // 执行注册并登录逻辑
    try {
      user = await ctx.models.User.create({
        wx_openid: wxUser.openid,
        nickname: wxUser.nickname,
        avatar: wxUser.headimgurl,
        sex: wxUser.sex.toString(),
        province: wxUser.province,
        city: wxUser.city,
        country: wxUser.country,
        password: md5('123456'),
        last_login: Date.now()
      })
      // 如果查询参数中存在inverter_id 说明是邀请的注册 则创建邀请记录
      if (ctx.request.body.inviter_id && typeof ctx.request.body.inviter_id === 'number') {
        const inviter = await ctx.models.User.findById(ctx.request.body.inviter_id)
        if (inviter) {
          const invite = await ctx.models.UserInvite.create({
            inviter_id: ctx.request.body.inviter_id,
            user_id: user.id,
            intro: '注册邀请'
          })
          // 用户新注册 并且是他人邀请的, 则赠送此人一张代金券
          const System = await ctx.models.SystemConfig.findOne({
            where: {
              id: 1
            }
          })
          await ctx.models.Coupon.create({
            name: '玥享券',
            value: System.INVITE_money || 50,
            status: '1',
            admin_id: null,
            user_id: user.id,
            invite_id: invite.id,
            intro: '好友邀请注册,赠送代金券',
            expire_at: moment().add(30, 'days').valueOf()
          })
          await ctx.models.Coupon.create({
            name: '玥享券',
            value: System.INVITE_money || 50,
            status: '1',
            admin_id: null,
            user_id: inviter.id,
            invite_id: invite.id,
            intro: '好友邀请注册,赠送代金券',
            expire_at: moment().add(30, 'days').valueOf()
          })
        }
      }
      let year = moment().year()
      let day = moment().dayOfYear()
      let loginKey = `signUp:${year}-${day}`
      let now = Math.floor(Date.now() / 1000)
      await redis.zadd(loginKey, now, user.id)
    } catch (err) {
      throw new APIError(500, ErrorsCategory[2], err.message)
    }
  } else {
    // 用户已经注册，微信登录后更新用户信息
    if (wxUser.nickname) user.nickname = wxUser.nickname
    if (wxUser.headimgurl) user.avatar = wxUser.headimgurl
    if (wxUser.sex) user.sex = wxUser.sex.toString()
    if (wxUser.province) user.province = wxUser.province
    if (wxUser.city) user.city = wxUser.city
    if (wxUser.country) user.country = wxUser.country
    user.last_login = Date.now()
    try {
      user = await user.save()
    } catch (err) {
      throw new APIError(500, ErrorsCategory[2], err.message)
    }
  }
  // 执行登录逻辑,发放token
  const accessToken = jwt.sign({
    seed: Math.random(),
    uuid: user.id
  }, System.JWT_secret, {
    expiresIn: System.JWT_expiresIn
  })
  // 记录在redis
  let year = moment().year()
  let day = moment().dayOfYear()
  let loginKey = `login:${year}-${day}`
  let now = Math.floor(Date.now() / 1000)
  await redis.zadd(loginKey, now, user.id)
  ctx.rest({
    ttl: System.JWT_expiresIn,
    created: Date.now(),
    token: `Bearer ${accessToken}`,
    user_id: user.id
  })
}
export const PutOne = async(ctx, next) => {
  ctx.checkParams('id').notEmpty('params id cannot be null').isInt('params id must be a number').toInt()
  ctx.checkBody('avatar').optional().isString('avatar must be a string')
  ctx.checkBody('nickname').optional().isString('nickname must be a string')
  ctx.checkBody('sex').optional().in(['0', '1', '2'], 'sex muset be in 0 1 2')
  ctx.checkBody('country').optional().isString('country must be a string')
  ctx.checkBody('province').optional().isString('province must be a string')
  ctx.checkBody('city').optional().isString('city must be a string')
  ctx.checkBody('password').optional().isString('password must be a string')
  ctx.checkBody('job').optional().isString('job must be a string')
  ctx.checkBody('age').optional().isInt('age must be a number')
  ctx.checkBody('phone').optional().isInt('phone must be a number')
  console.log(ctx.request.body)
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  if (ctx.params.id !== ctx.state.user.uuid) throw new APIError(400, ErrorsCategory[2], '不能更改别人的信息')
  let user = await ctx.models.User.findById(ctx.params.id)
  if (!user) throw new APIError(404, ErrorsCategory[4], 'user doesnot exist')
  if (ctx.request.body.avatar) user.avatar = ctx.request.body.avatar
  if (ctx.request.body.nickname) user.nickname = ctx.request.body.nickname
  if (ctx.request.body.sex) user.sex = ctx.request.body.sex
  if (ctx.request.body.province) {
    const province = ChinaAreaData['86'][ctx.request.body.province]
    if (province) user.province = province
  }
  if (ctx.request.body.city) {
   const city = ChinaAreaData[ctx.request.body.city]
   if (city) user.city = city
 }
  if (ctx.request.body.country) {
    const country = ChinaAreaData[ctx.request.body.country]
    if (country) user.country = country
  }
  if (ctx.request.body.password) user.password = md5(ctx.request.body.password)
  if (ctx.request.body.job) user.job = ctx.request.body.job
  if (ctx.request.body.age) user.age = ctx.request.body.age
  if (ctx.request.body.phone) user.phone = ctx.request.body.phone
  try {
    user = await user.save()
    ctx.rest(user)
  } catch (err) {
    throw new APIError(500, ErrorsCategory[2], err.message)
  }
}
