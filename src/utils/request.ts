import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: (import.meta as ImportMeta).env.VITE_APP_BASE_API
})

// request拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const method = config?.method?.toLocaleLowerCase() ?? ''
    if (['post', 'put'].includes(method)) {
      if (config.headers) {
        config.headers['Content-Type'] = 'application/json'
      }
    }
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, status, config, headers, statusText } = response
    if (status < 200 || status > 300) {
      ElMessage({
        message: statusText,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      const action = getAction(config, status)
      if (action) {
        ElMessage({
          message: action + '成功',
          type: 'success'
        })
      }
      const count = headers['x-total-count']
      if (count) {
        return {
          list: data,
          total: parseInt(count)
        }
      }
      return data
    }
  },
  (error) => {
    ElMessage({
      message: error.message ?? '未知错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error.code)
  }
)

function getAction (config: AxiosRequestConfig, status: number) {
  let action = ''
  if(status === 201) {
    action = '新增'
  } else {
    const method = config?.method?.toLocaleLowerCase() ?? ''
    if (method === 'put') {
      action = '修改'
    } else if (method === 'delete') {
      action = '删除'
    }
  }
  return action
}
export default service
