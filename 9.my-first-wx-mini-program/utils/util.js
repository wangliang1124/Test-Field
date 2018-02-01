const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getMovieListData = (url, callback) => {
  const _this = this
  wx.request({
    url: url,
    // data: {
    //   start: 0,
    //   count: 3,
    // },
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      callback(res)
      console.log(res)
    }
  })
}
module.exports = {
  formatTime: formatTime,
  getMovieListData,
}
