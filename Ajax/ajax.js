import $ from '../utils/utils'
import Qs from 'qs'

// 发送请求
class Ajax {
  constructor(config) {
    let self = this
    // 请求拦截器
    self.config = ajax.interceptors.request.pond[0](config)
    return self.request()
  }
  request() {
    let promise,
      xhr,
      self = this

    let { method, validateStatus, timeout, withCredentials, headers } = self.config
    // 返回一个promise实例, 基于ajax的请求结果,判断成败
    promise = new Promise((resovle, reject) => {
      xhr = new XMLHttpRequest()
      xhr.open(method.toUpperCase(), self.handleURL())

      // 超时, 资源凭证
      timeout > 0 ? (xhr.timeout = timeout) : null
      xhr.withCredentials = withCredentials
      //请求头
      self.handleHeader(xhr)
      xhr.onreadystatechange = () => {
        if (!validateStatus(xhr.status)) {
          // http状态码失败
          reject()
          return
        }
        // 主体信息返回 或者 head 拿到头部信息
        if (xhr.readyState === 4 || (method === 'HEAD' && xhr.readyState === 2)) {
          // 成功
          resovle()
        }
      }
      xhr.ontimeout = () => {
        // 失败: 请求超时
        reject()
      }
      xhr.send(self.handleBody())
    })
    // 响应拦截器
    let [onfulfilled, onrejected] = ajax.interceptors.response.pond
    return promise.then(onfulfilled, onrejected)
  }
  // 处理地址
  handleURL() {
    let self = this,
      { url, baseURL, method, cache, params } = self.config
    // 处理参数拼接
    const check = url => {
      url.includes('?') ? '&' : '?'
    }

    if (!/^http(s?):\/\//i.test(url)) url = baseURL + url

    // 问号传参
    if (params) {
      if ($.isPlainObject(params)) params = Qs.stringify(params)
      url += `${check(url)}${params}`
    }
    // get系列请求, 并且取消缓存
    if (methodsGET.includes(method.toUpperCase()) && cache === false) url += `${check(url)}_=${+new Date()}`
    return url
  }
  // 处理请求发送主体
  handleBody() {
    let self = this,
      { method, data, transformRequest, headers } = self.config

    // post 请求才处理请求主体信息
    if (!methodsPOST.includes(method.toUpperCase())) return null
    // 数据交由transformRequest处理后返回
    return transformRequest(data, headers)
  }
  // 处理请求头设置
  handleHeader(xhr) {
    let self = this,
      { headers, method } = self.config
    // 当前配置的请求头
    let methodHeader = headers[method.toUpperCase()]
    $.each(headers, (_, key) => {
      // 删除其余无用的请求方式
      if (methods.includes(key.toUpperCase())) {
        delete headers[key]
      }
    })
    // 将配置请求头合并到默认头内
    headers = $.merge(true, headers, methodHeader)
    // 迭代设置实例请求头
    $.each(headers, (value, key) => {
      xhr.setRequestHeader(key, value)
    })
  }
}

// 请求方式
let methodsGET = ['GET', 'DELETE', 'HEAD', 'OPTIONS'],
  methodsPOST = ['POST', 'PUT', 'PATCH'],
  // 全部方式
  methods = methodsGET.concat(methodsPOST),
  // 请求头
  headers = {
    'Content-Type': 'application/json'
  }

// 将所有方式配置到头内
methods.forEach(item => (headers[item.toLowerCase()] = {}))
// 默认配置项
let configRule = {
  /*
   *  type 数据类型
   *  defualt 默认值
   *  required 必传值
   */
  // 校验规则
  baseURL: {
    type: 'string',
    default: ''
  },
  url: {
    type: 'string',
    required: true
  },
  method: {
    type: 'string',
    default: 'GET'
  },
  transformRequest: {
    type: 'function',
    default(data, headers) {
      try {
        if ($.isPlainObject(data)) return JSON.stringify(data)
      } catch (err) {}

      return data
    }
  },
  headers: {
    type: 'object',
    default: null
  },
  params: {
    type: ['string', 'object'],
    default: {}
  },
  data: {
    type: ['string', 'object'],
    default: {}
  },
  cache: {
    type: 'boolean',
    default: false
  },
  timeout: {
    type: 'number',
    default: 0
  },
  withCredentials: {
    type: 'boolean',
    default: false
  },
  responseType: {
    type: 'string',
    default: 'json'
  },
  validateStatus: {
    type: 'function',
    default(status) {
      return (status >= 200) & (status < 300)
    }
  }
}

// 执行方法(规则校验 返回一个Ajax 实例)
const ajax = function ajax(config) {
  !$.isPlainObject(config) ? (config = {}) : null

  // 合并用户与默认配置项
  config = $.merge(true, {}, ajax.defaults, config)

  // 规则校验: 迭代configRule中的每一项, 再去看config中有没有这一项
  $.each(configRule, (value, key) => {
    // 默认项
    let { type, required, default: defaultValue } = value
    // 用户项
    let configValue = config[key],
      configType = $.toType(configValue)

    // type 是否为数组
    !Array.isArray(type) ? (type = [type]) : null
    // 未传值
    if (configType === 'undefined') {
      // 没有, 校验是否为必传
      if (required) throw new TypeError(`${key} must be required`)
      config[key] = defaultValue
    } else {
      // 传入类型检测
      if (!type.includes(configType)) throw new TypeError(`${key} must be an ${type}`)
      config[key] = $.merge(true, {}, defaultValue, configValue)
    }
  })

  // 发起请求
  return new Ajax(config)
}

// 快捷方法
methodsGET.forEach(item => {
  ajax[item.toLowerCase()] = function (url, config) {
    !$.isPlainObject(config) ? (config = {}) : null
    config.method = item
    config.url = url
    return ajax(config)
  }
})
methodsPOST.forEach(item => {
  ajax[item.toLowerCase()] = function (url, data, config) {
    !$.isPlainObject(config) ? (config = {}) : null
    config.method = item
    config.url = url
    config.data = data == null ? {} : data
    return ajax(config)
  }
})

// 并发请求控制
ajax.all = function all(queue) {
  if (!Array.isArray(queue)) throw new TypeError(`${queue} must be required an array`)
  return Promise.all(queue)
}

// 全局公共配置
ajax.defaults = {
  headers: $.clone(headers)
}

// 拦截器
class interceptors {
  pond = []
  use(onfulfilled, onrejected) {
    if (!$.isFunction(onfulfilled))
      onfulfilled = function onfulfilled(result) {
        return result
      }
    if (!$.isFunction(onrejected))
      onrejected = function onfulfilled(reason) {
        return Promise.reject(reason)
      }
    this.pond.push(onfulfilled)
    this.pond.push(onrejected)
  }
}
ajax.interceptors = {
  request: new interceptors(),
  response: new interceptors()
}

if (typeof window !== 'undefined') window.ajax = ajax

if (typeof module === 'object' && typeof module.exports === 'object') module.exports = ajax
