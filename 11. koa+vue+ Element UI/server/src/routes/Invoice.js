import * as Invoice from '../controllers/Invoice'
module.exports = {
  '*': async (ctx, next) => Invoice.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /invoice': async (ctx, next) => Invoice.GetList(ctx, next), // 获取申请开发票的列表
  'POST /invoice': async (ctx, next) => Invoice.PostOne(ctx, next), // 创建一个发票申请
  'PUT /invoice/:id': async (ctx, next) => Invoice.PutOne(ctx, next) // 更新一个发票申请
}
