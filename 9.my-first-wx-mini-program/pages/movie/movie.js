// pages/movie/movie.js
const app = getApp()
const util = require('../../utils/util.js') 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showingPath: '/v2/movie/in_theaters?start=0&count=3',
    comingSoonPath: '/v2/movie/coming_soon?start=0&count=3',
    top250Path: '/v2/movie/top250?start=0&count=3',
    inputValue: '',
    searchResult: {},
    searchShow: false,
    showingMovieList: [],
    comingSoonMovieList: [],
    top250MovieList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    console.log('=============movie load=========')
  },
  initData() {
    const base = app.globalData.doubanBase
    const showingUrl = base + this.data.showingPath
    const comingSoonUrl = base + this.data.comingSoonPath
    const top250Url = base + this.data.top250Path

    util.getMovieListData(showingUrl, (res)=> {
      this.setData({ showingMovieList: res.data.subjects})
    })

    util.getMovieListData(comingSoonUrl, (res) => {
      this.setData({ comingSoonMovieList: res.data.subjects })
    })

    util.getMovieListData(top250Url, (res) => {
      this.setData({ top250MovieList: res.data.subjects })
    })
  },
  onSearchFocus(event) {
    console.log('focus')

    this.setData({
      searchShow: true
    })
  },
  onSearchConfirm(event) {
    console.log(event.detail)
    const searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + event.detail.value
    util.getMovieListData(searchUrl, (res) => {
      this.setData({searchResult: res.data.subjects})
    })
  },
  onCloseTap() {
    console.log('ccccccccc')
    this.setData({ searchShow: false, searchResult: {}, inputValue: '' })
  },
  onMoreTap(event){
    // console.log(event.currentTarget.dataset.type)
    const type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/movie/movieMore/movieMore?type=' + type,
    })
  }
})