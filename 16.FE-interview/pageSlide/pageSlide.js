const pageSlide = (function(){
  const defaults = {
    slide: '.slide',
    pages: '.slide-page',
    useArrow: true,
    transition: true,
  }
  var eventHandler = {
    wheel: function(e) {
      e = e || window.event
      if(e.wheelDelta < 0 || e.detail > 0) {
        this.next()
      } else {
        this.prev()
      }
    }
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
    off: function() {},
  }
  //绑定事件
  var bindEvent = function(obj) {
    EventUtils.on(document, 'mousewheel', eventHandler.wheel.bind(obj))
    EventUtils.on(document, 'DOMMouseScroll', eventHandler.wheel.bind(obj))
  } 
  // 初始化
  var initTransition = function(els, index) {
    for(var i = 0, el = els[i]; i < els.length; i++){
      if (i === index) el.style.transform = 'translate3d(0, 0, 0)'
    }
  }
  // 构造函数
  function pageSlide(options) {
    this.opts = Object.assign({}, defaults, options)
    this.slide = document.querySelector(this.opts.slide)
    this.pages = document.querySelectorAll(this.opts.pages)
    this.count = this.pages.length
    this.index = 0
    this.init(this.index)
    if(this.opts.transition){ // && initTransition(this.pages, this.index)
      for(var i = 0; i < this.count; i++) {
        var page = this.pages[i]; // 必须加';'号

        (function(page) { // 利用闭包异步添加transition，防止刚打开时产生动画效果
          var timer = setTimeout(function () {
            page.classList.add('transition')
            clearTimeout(timer)
          }, 0)
        })(page)
      }
    } 
    // 绑定事件监听
    bindEvent(this)
  }
  pageSlide.prototype.init = function(index) {
    index > this.count - 1 ? index = this.count - 1 : index
    index < 0 ? index = 0 : index
    this.pages[index].style.transform = 'translate3d(0, 0, 0)'
  }
  pageSlide.prototype.next = function() {
    if (this.index === this.count - 1) {
      return false
    }
    this.pages[this.index].style.transform = 'translate3d(0, -100%, 0)'
    this.pages[this.index + 1].style.transform = 'translate3d(0, 0, 0)'
    this.index++
  }
  pageSlide.prototype.prev = function() {
    if (this.index === 0) {
      return false
    }
    this.pages[this.index].style.transform = 'translate3d(0, 100%, 0)'
    this.pages[this.index - 1].style.transform = 'translate3d(0, 0, 0)'
    this.index--
  }
  pageSlide.prototype.start = function() {}
  pageSlide.prototype.stop = function() {}

  return pageSlide
}())

// function init(options) {
//   options = Object.assign({}, defaults, options)
// }
window.pageSlide = pageSlide