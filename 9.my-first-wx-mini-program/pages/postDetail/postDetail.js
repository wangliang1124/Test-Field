const postData = require('../../assets/data/posts-data.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detail: {},
    collected:false,
    shared: false,
    played: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options)
  },
  init(options){
    // 获取新闻详情数据
    const id = parseInt(options.id, 10)
    const detail = postData.postList.find(item => item.postId === id)
    console.log(detail)
    this.setData({ id, detail })

    // 获取新闻收藏状态
    const postCollectedList = wx.getStorageSync('post_collected_list')
    // console.log(postCollectedList)
    if(postCollectedList) {
      console.log( postCollectedList)
      this.setData({collected: postCollectedList[id]})
    } else {
      const postCollectedList = {}
      postCollectedList[id] = false
      wx.setStorageSync('post_collected_list', postCollectedList)
    }

    // 监听音乐状态
    this.onMusicPlay()
  },
  onMusicPlay() {
    const _this  = this
    const played = app.globalData.played && this.data.id === app.globalData.postId // 判断当前页面之前是否播放了音乐   
    console.log('on===' + this.data.id +',' + app.globalData.postId)
    this.setData({ played })
    console.log(app.played)
    wx.onBackgroundAudioPlay(() => {
      _this.setData({played: true})
    })
    wx.onBackgroundAudioPause(() => {
      _this.setData({played: false})
    })
    wx.onBackgroundAudioStop(() => {
      _this.setData({played: false})
       app.globalData.played  = false
       app.globalData.postId = null
    })
  },
  onMusicTap(){
    const music = this.data.detail.music
    const _this = this
    if(!this.data.played) {
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg,
        success(){
          _this.setData({played: true})
          app.globalData.played  = true // 保存当前播放音乐的状态
          app.globalData.postId = _this.data.id // 保存当前播放音乐的新闻id       
        }
      })
    } else {
      wx.pauseBackgroundAudio()
      this.setData({played: false})
      app.globalData.played  = false
    }
  },
  onCollectionTap() {
    const _this = this
    const title = this.data.collected?'取消收藏':'收藏成功'
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 400,
      success(){
        // const collected = _this.data.collected
        // _this.setData({ collected: !collected })
        // 
        const id  = _this.data.id
        _this.setData({collected: !_this.data.collected})
        const postCollectedList = wx.getStorageSync('post_collected_list')
        console.log(id)
        postCollectedList[id] = _this.data.collected
        wx.setStorageSync('post_collected_list', postCollectedList)
      },
    })
  },
  onShareTap(){
    const _this = this
    const itemList = [
        "分享给微信好友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
    ];
    wx.showActionSheet({
      itemList,
      success(){
        console.log('===share success===')
        _this.setData({shared: true})
      },
    })
  },
})