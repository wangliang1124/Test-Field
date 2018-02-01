Page({
  onBtnTap(){
    // wx.redirectTo({
    //   url: '/pages/post/post',
    // })
    // console.log('================')
    wx.switchTab({
        url: '/pages/post/post'
    })
  }
})