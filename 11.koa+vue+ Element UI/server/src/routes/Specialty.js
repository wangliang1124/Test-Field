import * as Specialty from '../controllers/Specialty'
module.exports = {
  '*': async (ctx, next) => Specialty.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /specialty': async (ctx, next) => Specialty.GetList(ctx, next), // 获取平台所有的特色菜
  'GET /specialty/getcooktop11': async (ctx, next) => Specialty.GetCookTop11(ctx, next), // 获取厨师排行
  'POST /specialty': async (ctx, next) => Specialty.PostOne(ctx, next), // 管理员创建一个特色菜
  'GET /specialty/:id': async (ctx, next) => Specialty.GetOne(ctx, next), // 获取一个菜系的详细信息
  'PUT /specialty/like': async (ctx, next) => Specialty.PutLike(ctx, next), // 更新主厨点赞数
  'PUT /specialty/:id': async (ctx, next) => Specialty.PutOne(ctx, next), // 更新一个菜系的详细信息
  'DELETE /specialty/:id': async(ctx, next) => Specialty.DeleteOne(ctx, next)
}
