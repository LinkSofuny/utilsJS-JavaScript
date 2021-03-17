;(function () {
  /**
   * 1. 取消new
   * 2. 默认对象 => 合并
   * 3. 监测函数
   * 4. callback函数执行
   *
   */
  function LazyImage(options) {
    // 默认值
    let defaults = {
        context: document,
        threhold: 1,
        attr: 'lazy-image',
        speed: 300
      },
      configs = Object.assign(defaults, options)
    return new LazyImage.prototype.init(configs)
  }
  LazyImage.prototype = {
    constructor: LazyImage,
    init: function init(configs) {
      let options = { threhold: this.threhold }
      this.configs = configs
      // 监听器创建
      this.ob = new IntersectionObserver(changes => {
        changes.map(item => {
          let { isIntersecting, target } = item
          if (isIntersecting) {
            this.singleLazyLoad(target)
            this.ob.unobserve()
          }
        })
      }, options)

      this.observeALl()
    },
    // 监听函数
    observeALl: function observeALl() {
      let configs = this.configs
      let imgBox = configs.context.querySelector(`img[${configs.attr}]`)
      this.ob.observe(imgBox)
    },
    // 图片懒加载函数
    singleLazyLoad: function singleLazyLoad(imgBox) {
      let configs = this.configs
      console.log(imgBox)
      let imgObj = imgBox.querySelector('img')
      let imgSrc = imgBox.getAttribute(`${configs.attr}`)
      imgObj.src = imgSrc

      imgObj.style.opacity = 1
      imgObj.style.transition = `opacity ${configs.speed}`
    }
  }

  LazyImage.prototype.init.prototype = LazyImage.prototype

  if (typeof window !== 'undefined') window.LazyImage = LazyImage
  if (typeof module === 'objcet' && typeof module.exports === 'object') module.exports = LazyImage
})()
