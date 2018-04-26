const pageSlide = (function(){
  const defaults = {
    slide: '.slide',
    pages: '.slide-page',
    useArrow: true,
    isTransition: true,
  }
  var touchPoint = { startY: 0, endY: 0 }
  var eventHandler = {
    wheel: function(e) {
      // console.log(this.isSliding)
      if(this.isSliding) return
      e = e || window.event
      if(e.wheelDelta < 0 || e.detail > 0) {
        this.next()
      } else {
        this.prev()
      }
    },
    key: function(e) {
      if(this.isSliding) return
      e = e || window.event
      if(e.key === 'ArrowDown' || e.key === 'ArrowRight') { // keyCode = 40
        this.next()
      }
      if(e.key === 'ArrowUp' || e.key === 'ArrowLeft') { // keyCode = 38
        this.prev()
      }
      
    },
    touchStart: function(e) {
      console.log(e)
      touchPoint.startY = e.targetTouches[0].clientY
    },
    touchMove: function(e) {
      touchPoint.endY = e.targetTouches[0].clientY
    },
    touchEnd: function() {
      if(touchPoint.endY - touchPoint.startY < -60) {
        this.next()
      } else if (touchPoint.endY - touchPoint.startY > 60) {
        this.prev()
      }
      console.log(touchPoint)
    },
    transition: function(e) {
      e = e || window.event
      if(e.target === this.pages[this.index]) {
        this.isSliding = false
      }
    },
    test: function(e) { console.log(e) },
  }
  var EventUtils = {
    on: function(el, type, handler) {
      if(el.addEventListener) {
        el.addEventListener(type, handler, false)
      } else if(el.attachEvent){
        el.attachEvent('on' + type, handler)
      } else {
        el['on' + type] = handler
      }
    },
    off: function(el, type, handler) {
      if(el.removeEventListener) {
        el.removeEventListener(type, handler, false)
      } else if(el.detachEvent){
        el.detachEvent('on' + type, handler)
      } else {
        el['on' + type] = null
      }
    },
  }
  var Utils = {
    isElementInViewport: function (el) {
      var rect = el.getBoundingClientRect()
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          ~~rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
          ~~rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
      )
    },
  }
  var methods = {
    init: function(index) {
      index > this.count - 1 ? index = this.count - 1 : index // 校正index
      index < 0 ? index = 0 : index
      for(var i = 0; i < index; i++) { // 如果设置初始index为2，则之前的页面需要定位在-100%
        this.pages[i].style.transform = 'translate3d(0, -100%, 0)' 
      }
      this.pages[index].style.transform = 'translate3d(0, 0, 0)'
      if(this.opts.isTransition){
        for(let j = 0; j < this.count; j++) {
          // var page = this.pages[j]; // 必须加';'号

          // (function(page) { // 利用闭包异步添加transition，防止刚打开时产生动画效果
          //   var timer = setTimeout(function () {
          //     page.classList.add('transition')
          //     clearTimeout(timer)
          //   }, 0)
          // })(page)
          let timer = setTimeout(() => { // 异步添加transition，防止刚打开时产生动画效果
            this.pages[j].classList.add('transition')
            clearTimeout(timer)
          }, 0)
        }
      } 
    },
    //绑定事件
    bindEvent: function() {
      EventUtils.on(document, 'mousewheel', this.eventHandler.wheel)
      // EventUtils.on(document, 'mousewheel', this.eventHandler.test)
      EventUtils.on(document, 'DOMMouseScroll', this.eventHandler.wheel)
      if(this.opts.useArrow) {
        EventUtils.on(document, 'keyup', this.eventHandler.key)
      }
      EventUtils.on(document, 'touchstart', this.eventHandler.touchStart)
      EventUtils.on(document, 'touchmove', this.eventHandler.touchMove)
      EventUtils.on(document, 'touchend', this.eventHandler.touchEnd)
      EventUtils.on(this.slide, 'transitionend', this.eventHandler.transition)
    },
    unBindEvent: function() {
      EventUtils.off(document, 'mousewheel', this.eventHandler.wheel)
      EventUtils.off(document, 'DOMMouseScroll', this.eventHandler.wheel)
      if(this.opts.useArrow) {
        EventUtils.off(document, 'keyup', this.eventHandler.key)
      }
      EventUtils.off(document, 'touchstart', this.eventHandler.touchStart)
      EventUtils.off(document, 'touchmove', this.eventHandler.touchMove)
      EventUtils.off(document, 'touchend', this.eventHandler.touchEnd)
      EventUtils.off(this.slide, 'transitionend', this.eventHandler.transition)
    },
    mixinHandler: function() {
      this.eventHandler = {}
      for (var func in eventHandler) {
        this.eventHandler[func] = eventHandler[func].bind(this)
      }
    },
    setSliding: function() {
      // 如果没有启用transition效果，则设置一个200ms的缓冲时间，防止翻页过快
      setTimeout(() => {
        this.isSliding = !Utils.isElementInViewport(this.pages[this.index])
      }, 200)
    
    },
    // reset: function() {
    //   for(var i = 0; i < this.count; i++){
    //     this.pages[i].style.transform = 'translate3d(0, 100%, 0)'
    //   }
    // }
  }


  // 构造函数
  function pageSlide(options) {
    this.opts = Object.assign({}, defaults, options)
    this.slide = document.querySelector(this.opts.slide)
    this.pages = document.querySelectorAll(this.opts.pages)
    this.count = this.pages.length
    this.index = 0
    this.isSliding = false
    methods.init.call(this, this.index)
    methods.mixinHandler.call(this)
    methods.bindEvent.call(this) // 绑定事件监听
    // this.start()
  }

  pageSlide.prototype.next = function() {
    if (this.index === this.count - 1) {
      this.isSliding = false
      return false
    }
    this.isSliding = true
    this.pages[this.index].style.transform = 'translate3d(0, -100%, 0)'
    this.pages[++this.index].style.transform = 'translate3d(0, 0, 0)'
    // this.pages[this.index].style.opacity = '1'
    !this.opts.isTransition && methods.setSliding.call(this)
    
  }
  pageSlide.prototype.prev = function() {
    if (this.index === 0) {
      this.isSliding = false
      return false
    }
    this.isSliding = true
    this.pages[this.index].style.transform = 'translate3d(0, 100%, 0)'
    this.pages[--this.index].style.transform = 'translate3d(0, 0, 0)'
    !this.opts.isTransition && methods.setSliding.call(this)
  }
  // pageSlide.prototype.slideTo = function(index) {}
  // pageSlide.prototype.start = function() {
  //   setInterval(() => {
  //     this.next()
  //     console.log(this.index, this.count)
  //     if(this.index === this.count -1) {
  //       this.index = 0
  //     }
  //   }, 1000)
  // }
  pageSlide.prototype.stop = function() {}
  pageSlide.prototype.destroy = function() {
    methods.unBindEvent.call(this) // 释放监听程序
  }

  return pageSlide
}())

// function init(options) {
//   options = Object.assign({}, defaults, options)
// }
window.pageSlide = pageSlide