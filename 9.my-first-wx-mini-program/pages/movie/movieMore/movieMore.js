// pages/movie/movieMore/movieMore.js
const app = getApp()
const util = require('../../../utils/util.js') 

Page({
  /**
   * 页面的初始数据
   */
  data: {
    movieList: [],
    showingPath: '/v2/movie/in_theaters',
    comingSoonPath: '/v2/movie/coming_soon',
    top250Path: '/v2/movie/top250',
    title: '',
    url: '',
    total: 0,
    loadStart: 0,
    loadNum: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const base = app.globalData.doubanBase
    let url = ''
    // console.log(options.type)
    switch (options.type){
      case 'showing':
        url = base + this.data.showingPath
        this.setData({title: '正在热映'})
        break
      case 'comingSoon':
        url = base + this.data.comingSoonPath
        this.setData({ title: '即将上映' })
        break
      case 'top250':
        url = base + this.data.top250Path
        this.setData({ title: '豆瓣TOP250' })
        break
    }
    this.setData({ url })
    this.loadMore()
    // util.getMovieListData(url, (res) => {
    //   this.setData({ movieList: res.data.subjects })
    // })
  },
  onReady() {
    const _this = this
    wx.setNavigationBarTitle({
      title: _this.data.title,
    })
  },
  onScrollToBottom() {
    if(this.data.loadStart < this.data.total) {
      this.loadMore()
    } else {
      console.log('++++++++++加载完毕++++++++++')
    }
    
  }, 
  loadMore() {
    const url = this.data.url + '?start=' + this.data.loadStart + '&count=' + this.data.loadNum
    wx.showNavigationBarLoading()
    util.getMovieListData(url, (res) => {
      const list = this.data.movieList.concat(res.data.subjects)
      // console.log(list)
      // this.setData({ total: res.data.total })
      this.setData({ movieList: list, total: res.data.total })
      this.data.loadStart += this.data.loadNum
      wx.hideNavigationBarLoading()
    })
  },
})