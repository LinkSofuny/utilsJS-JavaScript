;(function () {
  'use strict'
  var class2type = {},
    getPrototype = Object.getPrototypeOf,
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty, // 获取私有属性
    ObjProto = Object.prototype

  // 数据类型检测
  var toType = function toType(obj) {
    // 为空
    if (obj == null) return obj + ''
    // 原始值
    if (typeof obj !== 'function' && typeof obj !== 'object') return typeof obj

    var instanceExp = /^\[object ([a-zA-Z]+)\]$/
    var value = instanceExp.exec(toString.call(obj))[1] || 'object'
    return value.toLowerCase()
  }
  // 检测是否为函数
  var isFunction = function isFunction(obj) {
    // 排除obj是<object>在某些浏览器下挥别识别为function的情况
    return typeof obj === 'function' && typeof obj.nodeType !== 'number'
  }
  // 检测是否为window对象
  var isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window
  }
  // 检测是否为数组或者类数组
  var isArrayLike = function isArrayLike(obj) {
    if (typeof obj !== 'function' && typeof obj !== 'object') return false
    var length = !!obj && 'length' in obj && obj.length,
      type = toType(obj)
    // window和function都有length属性, 但是他们不是数组
    if (isWindow(obj) || isFunction(obj)) return false
    // length - 1 in obj 确保最后一项的索引存在于类数组中
    // 类数组定义太宽幅, 只能保证类数组的最后一项存在于类数组中,
    return type === 'array' || length === 0 || (typeof length === 'number' && length > 0 && length - 1 in obj)
  }
  // 检测对象是否为纯粹对象
  var isPlainObject = function isPlainObject(obj) {
    if (!obj || !toType(obj)) return false
    var proto = getPrototype(obj)
    // Object.create(null) => {} 没有原型
    if (!proto) return true

    return proto === ObjProto
  }
  var isEmptyObject = function isEmptyObject(obj) {
    if (obj == null) return false
    var keys = Object.keys(obj)
    if (typeof Symbol !== 'undefined') {
      keys.concat(Object.getOwnPropertySymbols(obj))
    }
    return keys.length === 0
  }
  var isNum = function isNum(obj) {
    var type = toType(obj)
    if (obj == null) return false
    return (type === 'number' || type === 'string') && !isNaN(+obj)
  }
  // 遍历数组/类数组/对象(支持回调函数返回值处理: 返回false则结束循环)
  var each = function each(obj, callback) {
    // callback如果不是函数, 则让其等于一个匿名空函数
    toType(callback) !== 'function' ? (callback = Function.prototype) : null
    var len,
      i = 0,
      keys = []
    if (obj == null) return obj

    if (isArrayLike(obj)) {
      len = obj.length
      for (; i < len; i++) {
        var value = obj[i],
          result = callback.call(value, value, i)
        if (result === false) break
      }
    } else {
      // 对象
      i = 0
      keys = Object.keys(obj)
      len = keys.length
      // 合并唯一属性
      typeof Symbol !== 'undefined' ? keys.concat(Object.getOwnPropertySymbols(obj)) : null
      for (; i < len; i++) {
        var key = keys[i],
          value = obj[key]
        result = callback.call(key, value, key)
        if (result === false) break
      }
    }
    return obj
  }
  /**
   *  debounce: 函数防抖
   *    @params
   *      func [function, required]: 需要执行的函数,
   *      wait [number]: 设定触发的频次, 默认是300ms,
   *      immediate [boolean]: 设置触发边界, 前触发or 后触发.
   *    @return
   *      fnc执行的返回结果
   * by link on 2021年01月18日17:20:23
   * */
  var debounce = function debounce(func, wait, immediate) {
    if (typeof func !== 'function') throw new TypeError('func must be a function')

    if (typeof wait === 'boolean') {
      immediate = wait
      wait = 300
    }
    if (typeof wait !== 'number') wait = 300
    if (typeof immediate !== 'boolean') immediate = false

    let timer = null,
      result,
      params
    return function proxy() {
      params = [].slice.call(arguments)
      self = this

      let runNow = !timer && immediate
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        !immediate ? (result = func.apply(self, params)) : null
      }, wait)
      runNow ? (result = func.apply(self, params)) : null
      return result
    }
  }
  /**
   *  throttle: 函数防抖
   *    @params
   *      func [function, required]: 需要执行的函数,
   *      wait [number]: 设定触发的频次, 默认是300ms,
   *    @return
   *      fnc执行的返回结果
   * by link on 2021年01月18日17:20:23
   * */
  var throttle = function throttle(func, wait) {
    if (typeof func !== 'function') throw new TypeError('func must be a funciton')

    if (typeof wait !== 'number') wait = 300
    let previous = 0,
      timer = null,
      result
    return function proxy() {
      let now = +new Date(),
        remain = wait - (now - previous),
        self = this,
        params = [].slice.call(arguments)
      if (remain <= 0) {
        result = func.apply(self, params)
        previous = +new Date()
      } else if (!timer) {
        timer = setTimeout(() => {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
          result = func.apply(self, params)
        }, remain)
      }
      return result
    }
  }
  // 对象的深浅克隆
  var clone = function clone() {
    var target = arguments[0],
      deep,
      type = toType(target),
      result
    if (type === 'boolean') {
      deep = target
      target = arguments[1]
    }
    var isArray = isArrayLike(target),
      isObject = isPlainObject(target)
    // 特殊值拷贝
    // reg or date
    if (target == null) return target
    // 必须先处理 null 和undefined的情况
    var Ctor = target.constructor
    if (/^(regexp|date)$/i.test(type)) return new Ctor(target)
    if (/^(error)$/i.test(type)) return new Ctor(target.message)
    if (/^(function|generatorfuntion)$/i.test(type)) {
      return function proxy() {
        var args = Array.from(arguments)
        return target.apply(this, args)
      }
    }

    // 如果是数组或者对象, 依次迭代赋值给新的数组/对象
    if (!isArray && !isObject) return target
    result = new Ctor()
    each(target, function (copyVal, name) {
      if (deep) {
        // 深拷贝
        result[name] = clone(deep, copyVal)
        return
      }
      result[name] = copyVal
    })

    return result
  }
  // 暴露API
  var utils = {
    toType: toType,
    isFunction: isFunction,
    isWindow: isWindow,
    isArrayLike: isArrayLike,
    isPlainObject: isPlainObject,
    isEmptyObject: isEmptyObject,
    isNum: isNum,
    debounce: debounce,
    throttle: throttle,
    each: each,
    clone: clone
  }

  if (typeof window !== 'undefined') {
    window._ = window.utils = utils
  }
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = utils
  }
})()
