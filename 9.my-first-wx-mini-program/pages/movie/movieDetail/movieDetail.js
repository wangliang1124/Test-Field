// pages/movie/movieDetail/movieDetail.js
const app = getApp()
const util = require('../../../utils/util.js') 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    starNum: 0,
    score: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const base = app.globalData.doubanBase
    const url = base + '/v2/movie/subject/' + options.movieId  // options.movieId
    util.getMovieListData(url, (res) => {
      this.setData({ movie: res.data })
      const score = this.data.movie.rating.average
      this.setData({ starNum: Math.floor(Math.round(score) / 2) })
      this.setData({ score })
    })
  },
})