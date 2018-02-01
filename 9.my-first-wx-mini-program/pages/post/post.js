// pages/post/post.js
var postData = require('../../assets/data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImgList: [
    { 
      imgUrl: '/assets/img/iqiyi.png', 
      url: '/pages/postDetail/postDetail?id=5' 
    }, {
      imgUrl: '/assets/img/vr.png', 
      url: '/pages/postDetail/postDetail?id=4' 
    },{
      imgUrl: '/assets/img/wx.png', 
      url: '/pages/postDetail/postDetail?id=3' 
    }],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({postList:postData.postList})
  },
  onPostTap(event){
    console.log(event)
    wx.navigateTo({
      url: `../postDetail/postDetail/?id=${event.currentTarget.dataset.postid}`,
      // success(){
      //   console.log('测试')
      // },
    })
  },
})