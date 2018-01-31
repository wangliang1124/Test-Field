import * as SpecialtyRecord from '../controllers/SpecialtyRecord'
module.exports = {
  '*': async (ctx, next) => SpecialtyRecord.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /record': async (ctx, next) => SpecialtyRecord.GetList(ctx, next), // 获取特权使用记录
  'POST /record': async (ctx, next) => SpecialtyRecord.PostOne(ctx, next), // 创建一个特权使用记录
  'PUT /record/:id': async (ctx, next) => SpecialtyRecord.PutOne(ctx, next), // 更新一个特权使用记录
  'DELETE /record/:id': async (ctx, next) => SpecialtyRecord.DelectOne(ctx, next) // 删除一个特权使用记录
}
