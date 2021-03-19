// axios 的二次封装
const axios = require('axios')
const qs = require('qs')

// axios.defauls 默认配置
// axios.interceptors 拦截器

// 配置项
let options = {
  // 当前项目url地址
  baseURL: 'http://localhost:9000',
  // 当前环境变量
  timeout: 10000,
  // 跨域资源共享, 是否携带资源凭证
  withCredentials: true,
  // post请求头信息格式
  postContentType: 'application/x-www-form-urlencoded'
}

// 判断当前环境
const ENV = process.env.NODE_ENV || 'development'
// 根据不同环境灵活配置
switch (ENV) {
  case 'development':
    options.baseURL = 'http://localhost:9000'
    break
  case 'test':
    options.baseURL = 'http://localhost:9000'
    break
  case 'production':
    options.baseURL = 'http://localhost:9000'
    break
}

// 当前项目url地址
axios.defaults.baseURL = `${options.baseURL}`
// 设置超时时间
axios.defaults.timeout = `${options.timeout}`
// 跨域资源共享, 是否携带资源凭证
axios.defaults.withCredentials = `${options.withCredentials}`

// 公共自定义请求头信息
// axios.default.headers ==> common

// post请求头
axios.defaults.headers.post['Content-Type'] = `${options.postContentType}`

// post请求对请求主体信息的统一格式化
axios.defaults.headers.transformRequest = function (data, headers) {
  if (data === null || typeof data !== 'object') return data

  let contentType = headers['Content-type'] || headers.post['Content-Type']

  if (contentType.includes('urlencoded')) return qs.stringify(data)

  if (contentType.includes('json')) return JSON.stringify(data)

  return data
}

// 响应状态码状态处理(规定状态码的成功状态范围)
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300
}

// 请求拦截器
axios.interceptors.request.use(function () {
  // token验证
  const token = sessionStorage.getItem('token')

  if (token) {
    config.headers['Authorization'] = token
  }
  return config
})

// 响应拦截器
axios.interceptors.responese.use(
  function onfulfilled(response) {
    return response.data
  },
  function onrejected(reson) {}
)

export default axios
