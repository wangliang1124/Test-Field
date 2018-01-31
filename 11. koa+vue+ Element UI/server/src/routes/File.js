import * as File from '../controllers/File'
module.exports = {
  '*': async (ctx, next) => File.entryVerify(ctx, next), // 路由类的统一入口验证
  'GET /protocol/order': async (ctx, next) => File.GetProtocol(ctx, next), // 获取用户协议
  'GET /excel/type': async (ctx, next) => File.GetExcel(ctx, next) // excel文件下载
}
