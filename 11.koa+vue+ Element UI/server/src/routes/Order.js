import * as Order from '../controllers/Order'
module.exports = {
  '*': async (ctx, next) => Order.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /order': async (ctx, next) => Order.GetList(ctx, next), // 获取订单列表
  'GET /group/order': async (ctx, next) => Order.GetGroupList(ctx, next), // 获取订单列表
  'PUT /group/order/:id': async (ctx, next) => Order.PutOneGroup(ctx, next), // 获取订单列表
  'POST /order': async (ctx, next) => Order.PostOne(ctx, next), // 创建一个订单
  'POST /order/pay': async (ctx, next) => Order.PayOne(ctx, next), // 创建一个订单
  'POST /order/group': async (ctx, next) => Order.GroupOne(ctx, next), // 创建一个团购订单
  'POST /order/pay/group': async (ctx, next) => Order.PayGroupOne(ctx, next), // 支付一个团购订单
  'POST /order/gooditem': async (ctx, next) => Order.GoodItemOrder(ctx, next), // 创建GootItem订单
  'POST /order/pay/gooditem': async (ctx, next) => Order.PayGoodItem(ctx, next), // 支付一个团购订单
  'POST /order/reserve': async (ctx, next) => Order.OrderReserve(ctx, next), // 创建预定订单
  'PUT /order/:id': async (ctx, next) => Order.PutOne(ctx, next), // 更新一个订单
  'DELETE /order/:id': async (ctx, next) => Order.DelectOne(ctx, next) // 删除一个订单
}
