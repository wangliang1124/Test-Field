import * as Tag from '../controllers/Tag'
module.exports = {
  '*': async (ctx, next) => Tag.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /tag/card': async (ctx, next) => Tag.GetList(ctx, next), // 获取尊享卡标签列表
  'POST /tag/card': async (ctx, next) => Tag.PostOne(ctx, next), // 创建一个尊享卡标签
  'DELETE /tag/card/:id': async (ctx, next) => Tag.DelectOne(ctx, next) // 删除一个尊享卡标签
}
