// 兼容IE9+
;(function () {
  'use strict'
  function Promise(executor) {
    var self = this,
      change

    // 必须NEW执行 && EXECUTOR必须是一个函c数
    if (!(self instanceof Promise)) throw new TypeError('undefined is not a promise!')
    if (typeof executor !== 'function') throw new TypeError('Promise resolver ' + executor + ' is not a function!')

    self.PromiseResult = undefined
    self.PromiseState = 'pending'
    // 成功与失败 事件池
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []

    // 用于改变promise实例中的 结果 与 状态
    change = function change(state, result) {
      if (self.state !== 'pending') return
      self.result = result
      self.state = state

      // 如果实例状态发生改变, 则通知事件池中的任务执行
      var callbacks = state === 'fulfilled' ? self.onFulfilledCallbacks : self.onRejectedCallbacks,
        i = 0,
        len = callbacks.length,
        callback
      if (len > 0) {
        setTimeout(function () {
          for (; i < len; i++) {
            callback = callbacks[i]
            if (typeof callback === 'function') callback(self.result)
          }
        }, 0)
      }
    }

    try {
      executor(
        function resolve(result) {
          change('fulfilled', result)
        },
        function reject(reason) {
          change('rejected', reason)
        }
      )
    } catch (error) {
      change('rejected', error)
    }
  }
  // onFulfilled是否返回一个promise实例
  function isPromise(x) {
    if (x == null) return false
    if (/^(object|function)$/i.test(typeof x)) {
      if (typeof x.then === 'function') {
        return true
      }
    }
    return false
  }
  // onFulfilled, onRejected方法的执行返回结果处理
  function handle(newPromise, x, resolve, reject) {
    if (newPromise === x) throw new TypeError('Chaining cycle detected for promise')
    if (isPromise(x)) {
      try {
        // Promise实例x的执行结果决定newPromise的状态
        x.then(resolve, reject)
      } catch (error) {
        reject(error)
      }
      return
    }
    // 普通函数正常执行
    resolve(x)
  }

  Promise.prototype = {
    constructor: Promise,
    self: true,
    then: function (onFulfilled, onRejected) {
      var self = this,
        x,
        newPromise

      if (typeof onFulfilled !== 'function') {
        onFulfilled = function onFulfilled(result) {
          return result
        }
      }
      if (typeof onRejected !== 'function') {
        onRejected = function onFulfilled(reason) {
          throw reason
        }
      }
      newPromise = new Promise(function (resolve, reject) {
        // 1. 已经知道了pomise实例的状态成功与否
        // 2. 还未知, 则等待promise实例内executor的执行
        switch (self.state) {
          case 'fulfilled':
            setTimeout(function () {
              try {
                x = onFulfilled(self.result)
                handle(newPromise, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            }, 0)
            break
          case 'rejected':
            setTimeout(function () {
              try {
                x = onRejected(self.result)
                handle(newPromise, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            }, 0)
            break
          default:
            self.onFulfilledCallbacks.push(function (result) {
              try {
                x = onFulfilled(result)
                handle(newPromise, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            })
            self.onRejectedCallbacks.push(function (reason) {
              try {
                x = onRejected(reason)
                handle(newPromise, x, resolve, reject)
              } catch (err) {
                reject(err)
              }
            })
        }
      })
      return newPromise
    },
    catch: function (onRejected) {
      var self = this
      return self.then(null, onRejected)
    },
    finally: function () {}
  }

  if (typeof Symbol !== 'undefined') Promise.prototype[Symbol.toStringTag] = 'Promise'

  Promise.resolve = function resolve(value) {
    return new Promise(function (resolve) {
      resolve(value)
    })
  }
  Promise.reject = function reject(value) {
    return new Promise(function (resolve) {
      reject(value)
    })
  }
  Promise.all = function all(promises) {
    var results = [],
      newPromise,
      // 计数器
      n = 0
    if (!Array.isArray(promises)) throw new TypeError(promises + 'is not iterable')
    promises = promises.map(function (promise) {
      if (!isPromise(promise)) return new Promise.resolve(promise)
      return promise
    })
    newPromise = new Promise(function (resolve, reject) {
      promises.forEach(function (promise, index) {
        promise
          .then(function (result) {
            // push容易造成顺序混乱, 因为不能保证promise内执行函数是否为同步
            results[index] = result
            n++
            if (n >= promises.length) resolve(results)
          })
          .catch(function (reason) {
            reject(reason)
          })
      })
    })
    return newPromise
  }

  // API暴露
  if (typeof window === 'object') window.Promise = Promise
  if (typeof module === 'object' && typeof module.exports === 'object') module.exports = Promise
})()
