// pages/movie/movieList/movieList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movieList: {
      type: Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMovieTap(event) {
      // console.log(event)
      const movieId = event.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/movie/movieDetail/movieDetail?movieId=' + movieId,
      })
    },
  }
})
