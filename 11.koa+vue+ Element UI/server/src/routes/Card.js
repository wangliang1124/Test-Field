import * as Card from '../controllers/Card'
module.exports = {
  '*': async (ctx, next) => Card.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /card': async (ctx, next) => Card.GetList(ctx, next), // 获取寄卖会员卡列表
  'POST /card': async (ctx, next) => Card.PostOne(ctx, next), // 创建一个寄卖会员卡
  'PUT /card/:id': async (ctx, next) => Card.PutOne(ctx, next), // 更新一个寄卖会员卡
  'DELETE /card/:id': async (ctx, next) => Card.DelectOne(ctx, next) // 删除一个寄卖会员卡
}
