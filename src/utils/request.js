import axios from 'axios'
import { Toast, Notify } from 'vant'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  withCredentials: true
})

request.interceptors.request.use((config) => {
  // 请求拦截
  // config.params.timestamp = +new Date()
  
  return config
})

request.interceptors.response.use(
  (response) => {
    if(response.status !== 200) {
      return response.body
    }
    const res = response.data
    return res
  },
  (error) => {
    Notify(error.message)
    return error.message
  }
)

export default request
