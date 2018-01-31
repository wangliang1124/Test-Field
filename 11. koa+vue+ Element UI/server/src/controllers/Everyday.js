import Redis from 'ioredis'
import Promise from 'bluebird'
const redis = new Redis(6379, '127.0.0.1')
export const entryVerify = async (ctx, next) => {
  return next()
}

export const GetList = async (ctx, next) => {
  let loginKeys = await redis.keys('login:*')
  let loginLabels = loginKeys.slice(-30)
  let labels1 = loginLabels.map(l => l.split('-')[1])
  let dataPromises = loginLabels.map(async l => {
    let num = await redis.zcard(l)
    return num
  })
  let data1 = await Promise.all(dataPromises)

  let signupKeys = await redis.keys('signUp:*')
  let signupLabels = signupKeys.slice(-30)
  let labels2 = signupLabels.map(l => l.split('-')[1])
  let dataPromises2 = signupLabels.map(async l => {
    let num = await redis.zcard(l)
    return num
  })
  let data2 = await Promise.all(dataPromises2)

  let payKeys = await redis.keys('pay:*')
  let payLabels = payKeys.slice(-30)
  let labels3 = payLabels.map(l => l.split('-')[1])
  let dataPromises3 = payLabels.map(async l => {
    let num = await redis.zcard(l)
    return num
  })
  let data3 = await Promise.all(dataPromises3)

  let recordKeys = await redis.keys('record:*')
  let recordLabels = recordKeys.slice(-30)
  let labels4 = recordLabels.map(l => l.split('-')[1])
  let dataPromises4 = recordLabels.map(async l => {
    let num = await redis.zcard(l)
    return num
  })
  let data4 = await Promise.all(dataPromises4)
  ctx.rest([[labels1, data1], [labels2, data2], [labels3, data3], [labels4, data4]])
}
