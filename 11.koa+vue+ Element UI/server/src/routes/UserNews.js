import * as UserNews from '../controllers/UserNews'
module.exports = {
  '*': async (ctx, next) => UserNews.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /news': async (ctx, next) => UserNews.GetList(ctx, next), // 获取所有的消息
  'POST /news': async (ctx, next) => UserNews.PostOne(ctx, next), // 创建N个消息给用户
  'PUT /news/:id': async (ctx, next) => UserNews.PutOne(ctx, next), // 更新一条消息的状态
  'DELETE /news/:id': async (ctx, next) => UserNews.DelectOne(ctx, next) // 删除一个消息
}
