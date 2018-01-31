import * as SpecialtyLiked from '../controllers/SpecialtyLiked'
module.exports = {
  '*': async (ctx, next) => SpecialtyLiked.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /like': async (ctx, next) => SpecialtyLiked.GetList(ctx, next), // 获取点赞列表
  'POST /like': async (ctx, next) => SpecialtyLiked.PostOne(ctx, next), // 创建一个点赞
  // 'PUT /specialty/like/:id': async (ctx, next) => SpecialtyLiked.PutOne(ctx, next), // 更新一个点赞
  'DELETE /like/:specialty_id': async (ctx, next) => SpecialtyLiked.DelectOne(ctx, next) // 删除一个点赞
}
