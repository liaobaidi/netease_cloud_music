import axios from 'axios'
import { Toast, Notify } from 'vant'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000, // 超时时间
  retryTimes: 10, // 重连阈值
  withCredentials: true
})

request.interceptors.request.use((config) => {
  // 请求拦截
  // config.params.timestamp = +new Date()

  return config
})

request.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return response.body
    }
    const res = response.data
    return res
  },
  (err) => {
    let config = err.config
    if (err.message == 'timeout of 10000ms exceeded') {
      Notify('网络连接超时，正在重连')
      const { __retryCount = 0, retryDelay = 300, retryTimes } = config
      // 在请求对象上设置重试次数
      config.__retryCount = __retryCount
      // 判断是否超过了重试次数
      if (config.__retryCount >= retryTimes) {
        return err.response.data || err
      }
      // 增加重试次数
      config.__retryCount++
      // 延时处理
      const delay = new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, retryDelay)
      })
      // 重新发起请求
      return delay.then(function () {
        return request(config)
      })
    }
    if (err.message == 'Network Error') {
      Notify('网络错误')
    }
    return err.response.data || err
  }
)

export default request
