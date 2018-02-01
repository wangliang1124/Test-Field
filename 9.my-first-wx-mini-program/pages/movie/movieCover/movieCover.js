// pages/movie/movieCover/movieCover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movie: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    starNum: 0,
    score: 0,
  },
  attached() {
    // console.log('cover attched')
    // console.log(this.data.movie)
    const score = this.data.movie.rating.average
    this.setData({ starNum: Math.floor(Math.round(score) / 2) })
    this.setData({ score })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
