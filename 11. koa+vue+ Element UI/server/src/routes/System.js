import * as SystemConfig from '../controllers/SystemConfig'
module.exports = {
  '*': async (ctx, next) => SystemConfig.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /system': async (ctx, next) => SystemConfig.GetList(ctx, next), // 获取系统配置
  'PUT /system/:id': async (ctx, next) => SystemConfig.PutOne(ctx, next) // 更新系统配置
}
