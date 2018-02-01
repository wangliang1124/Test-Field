import { SystemConfig } from '../config'

// 调试
export const log = (obj) => {
  console.log('==================调试=================')
  console.log(obj)
}

// 截取字符串，多余的部分用...代替
export const setString = (str, len) => {
  let StrLen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      StrLen += 2
    } else {
      StrLen++
    }
    s += str.charAt(i)
    if (StrLen >= len) {
      return s + '...'
    }
  }
  return s
}

// 格式化设置
export const OptionFormat = (GetOptions) => {
  let options = '{'
  for (let n = 0; n < GetOptions.length; n++) {
    options = options + '\'' + GetOptions[n].option_name + '\':\'' + GetOptions[n].option_value + '\''
    if (n < GetOptions.length - 1) {
      options = options + ','
    }
  }
  return JSON.parse(options + '}')
}

// 替换SQL字符串中的前缀
export const SqlFormat = (str) => {
  if (SystemConfig.mysql_prefix !== 'api_') {
    str = str.replace(/api_/g, SystemConfig.mysql_prefix)
  }
  return str
}

// 数组去重
export const HovercUnique = (arr) => {
  let n = {}
  let r = []
  for (var i = 0; i < arr.length; i++) {
    if (!n[arr[i]]) {
      n[arr[i]] = true
      r.push(arr[i])
    }
  }
  return r
}
// 随机生成字符串
export const generateRandomAlphaNum = function (len) {
  let length = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var maxPos = chars.length
  var pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd.toUpperCase()
}
// 获取json长度
export const getJsonLength = (jsonData) => {
  var arr = []
  for (var item in jsonData) {
    arr.push(jsonData[item])
  }
  return arr.length
}
// 把obj转化成为 query string
export const queryParameters = data => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&')
// 把get接口中query 参数转化为安全的sequelize where语句
export const queryToSequelizeWhereSafely = async (queryObj, model, notSearch) => {
  // console.log('queryquery' + queryObj)
  if (typeof queryObj !== 'object' || typeof model !== 'object') return
  let page = 1
  let order = 'DESC'
  let perPage = 10
  let sortby = 'id'
  let field = null
  let filter = ''
  let q = null
  let where = {}
  let attrs = Object.keys(await model.describe()).map(k => k)
  Object.keys(queryObj).map(key => {
    switch (key) {
      case 'page':
        if (!/^\+?[1-9][0-9]*$/.test(queryObj[key])) {
          page = 1
        } else {
          page = parseInt(queryObj[key])
        }
        break
      case 'per_page':
        if (!/^\+?[1-9][0-9]*$/.test(queryObj[key])) {
          perPage = 10
        } else {
          perPage = parseInt(queryObj[key])
        }
        break
      case 'sortby':
        if (typeof queryObj[key] !== 'string' || attrs.indexOf(queryObj[key]) < 0) {
          sortby = 'id'
        } else {
          sortby = queryObj[key]
        }
        break
      case 'order':
        if (typeof queryObj[key] !== 'string' || ['desc', 'asc'].indexOf(queryObj[key]) < 0) {
          order = 'DESC'
        } else {
          order = queryObj[key].toUpperCase()
        }
        break
      case 'field':
        field = queryObj[key]
        break
      case 'filter':
        filter = queryObj[key]
        break
      case 'q':
        q = queryObj[key]
        break
      default:
        if (attrs.indexOf(key) >= 0 && key !== 'version' && key !== 'deleted_at') {
          if (!where.where) where.where = {}
          if (key === 'user_id') {
            where.where[key] = {
              $eq: parseInt(queryObj[key])
            }
          } else {
            where.where[key] = {
              $eq: queryObj[key]
            }
          }
        }
        break
    }
  })
  where.offset = (page - 1) * perPage
  where.limit = perPage
  where.order = [[sortby, order]]
  if (q && !notSearch) {
    if (!where.where) where.where = {}
    if (attrs.indexOf(field) >= 0 && field !== 'deleted_at' && field !== 'version') {
      where.where[field] = {
        $like: `%${q}%`
      }
    } else {
      where.where.$or = {}
      attrs.forEach(a => {
        if (a !== 'deleted_at' && a !== 'version') {
          where.where.$or[a] = {
            $like: `%${q}%`
          }
        }
      })
    }
  }
  if (filter && !notSearch) {
    if (!where.where) where.where = {}
    const filterObj = JSON.parse(filter)
    Object.keys(filterObj).map(k => {
      where.where[k] = filterObj[k]
    })
  }
  return where
}

export const getFlatternDistance = function (lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      return null
    }
    const radLat1 = getRad(lat1)
    const radLat2 = getRad(lat2)
    const deltaLat = radLat1 - radLat2
    const deltaLng = getRad(lng1) - getRad(lng2)
    return (2 * Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(deltaLat / 2), 2) + (Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2))
          )
        )
      ) * 6378137
    function getRad (d) {
      return d * Math.PI / 180.0
    }
  }
