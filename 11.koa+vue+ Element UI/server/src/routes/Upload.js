import * as Upload from '../controllers/Upload'
module.exports = {
  'ALL /upload/image': async (ctx, next) => Upload.Upload(ctx, next), // 文件上传
  'POST /upload/base64': async (ctx, next) => Upload.UploadBase64(ctx, next), // 文件上传
  'POST /upload/wx': async (ctx, next) => Upload.UploadWx(ctx, next)
}
