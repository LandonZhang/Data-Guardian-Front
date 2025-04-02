import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 打印当前API基础URL
// console.log('当前API基础URL:', import.meta.env.VITE_API_BASE_URL)

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response // .data在代码中呈现
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default request
