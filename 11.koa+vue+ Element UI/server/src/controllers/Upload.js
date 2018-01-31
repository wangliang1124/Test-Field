import fs from 'fs'
import path from 'path'
import WechatAPI from 'wechat-api'
import Promise from 'bluebird'
import { System as SystemConfig } from '../config'
import {APIError} from '../middlewares/restify'
import {ErrorsCategory} from '../config/index'

Promise.promisifyAll(WechatAPI.prototype)
const wxApi = new WechatAPI(SystemConfig.pubWxAppId, SystemConfig.pubWxAppSecret)
export const Upload = (ctx, next) => {
  console.log('======>upload')
  // 设置允许跨域的域名称
  // ctx.set('Access-Control-Allow-Origin', '*')
  // ctx.set('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
  // ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // ----- 情况1：跨域时，先发送一个options请求，此处要返回200 -----
  if (ctx.method === 'OPTIONS') {
    console.log('options 请求时，返回 200')

    // 返回结果
    ctx.status = 200
    ctx.body = 'options OK'
    return
  }
  // ----- 情况2：发送post请求，上传图片 -----
  // 处理 request
  console.log('parse ok')
  // 文件将要上传到哪个文件夹下面
  var uploadfolderpath = path.join(__dirname, '../../assets/uploads')

  var files = ctx.request.body.files
  console.log('==================')
  // formidable 会将上传的文件存储为一个临时文件，现在获取这个文件的目录
  if (typeof files.file === 'undefined') { // vue-core-image-upload
    files.file = files.files
    console.log(files.file.path)
  }
  // else {
  //   tempfilepath = files.file.path
  // }
  var tempfilepath = files.file.path

  // 获取文件类型
  var type = files.file.type
  // 获取文件名，并根据文件名获取扩展名
  var filename = files.file.name
  var extname = filename.lastIndexOf('.') >= 0 ? filename.slice(filename.lastIndexOf('.') - filename.length) : ''
  // 文件名没有扩展名时候，则从文件类型中取扩展名
  if (extname === '' && type.indexOf('/') >= 0) {
    extname = '.' + type.split('/')[1]
  }
  // 将文件名重新赋值为一个随机数（避免文件重名）
  filename = Math.random().toString().slice(2) + extname
  console.log('+++++++++++++++++++++' + filename)
  // 构建将要存储的文件的路径
  var filenewpath = path.join(uploadfolderpath, filename)

  var result = ''

  // 将临时文件保存为正式的文件
  try {
    fs.renameSync(tempfilepath, filenewpath)
  } catch (err) {
    if (err) {
      // 发生错误
      console.log('fs.rename err')
      result = 'error|save error'
    }
  }
  // 保存成功
  console.log('fs.rename done')
  // 拼接url地址
  result = '/assets/uploads/' + filename

  // 返回结果
  ctx.rest(result)
}
export const UploadBase64 = (ctx, next) => {
    if (ctx.method === 'OPTIONS') {
      console.log('options 请求时，返回 200')

      // 返回结果
      ctx.status = 200
      ctx.body = 'options OK'
      return
    }
    const imgData = ctx.request.body.content
    const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
    const dataBuffer = new Buffer(base64Data, 'base64')
    const nowTime = Date.now()
    const backUrl = `/assets/uploads/${nowTime}.png`
    const url = path.resolve(__dirname, `../../assets/uploads/${nowTime}.png`)
    fs.writeFile(url, dataBuffer, function (err, result) {
        if (err) {
          throw new APIError(400, ErrorsCategory[2], err.message)
        } else {
          ctx.body = backUrl
        }
    })
}
export const UploadWx = async (ctx, next) => {
  const getMediaPromise = function (mediaId) {
    return new Promise((resolve, reject) => {
      wxApi.getMedia(mediaId, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
  const writeFilePromise = function (url, imageBuffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(url, imageBuffer, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
  ctx.checkBody('media_id').notEmpty('media_id cannot be null').isString('media_id must be a string')
  if (ctx.errors) throw new APIError(400, ErrorsCategory[3], ctx.errors[0])
  // const imgBuffer = await wxApi.getMedia(ctx.request.body.media_id)
  try {
    const imageBuffer = await getMediaPromise('SGk8vAKvhjFVUqzDE09mxC6pIGUQUo6hK5afz0K1m5v_EXGUmVrGSRbFJpNVbZmC')
    const nowTime = Date.now()
    const url = `../../assets/uploads/${nowTime}.png`
    const backUrl = `/assets/uploads/${nowTime}.png`
    await writeFilePromise(path.resolve(__dirname, url), imageBuffer)
    const data = {url: backUrl}
    ctx.rest(data)
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
