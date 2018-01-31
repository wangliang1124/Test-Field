import * as SpecialtyCollected from '../controllers/SpecialtyCollected'
module.exports = {
  '*': async (ctx, next) => SpecialtyCollected.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /collect': async (ctx, next) => SpecialtyCollected.GetList(ctx, next), // 获取点赞收藏
  'GET /collect/ranklist': async (ctx, next) => SpecialtyCollected.GetRankList(ctx, next), // 获取一个餐厅点赞收藏
  'POST /collect': async (ctx, next) => SpecialtyCollected.PostOne(ctx, next), // 创建一个收藏
  // 'PUT /specialty/collect/:id': async (ctx, next) => SpecialtyCollected.PutOne(ctx, next), // 更新一个收藏
  'DELETE /collect/:specialty_id': async (ctx, next) => SpecialtyCollected.DelectOne(ctx, next) // 删除一个收藏
}
