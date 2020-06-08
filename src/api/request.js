import Axios from 'axios'

// 1. 创建axios实例
const instance = Axios.create({
  baseURL: 'http://localhost:9001',
  timeout: 3000
})

// 2. 拦截器
// 2.1 请求拦截
instance.interceptors.request.use(
  config => {
    // 比如看是否有没有令牌，加个请求发送得过渡效果
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    // 记住放行
    return config
  })
// 2.2 响应拦截
instance.interceptors.response.use(
  config => {
    return config
  }
)

export function request () {
  return instance
}
