import type { AxiosRequestConfig } from 'axios'
import service from './request'
const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  post<T = any, R = T>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return service.post(url, data, config)
  },
  put<T = any, R = T>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return service.put(url, data, config)
  },
  delete<T = EmptyObject>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.delete(url, config)
  }
}
export default http
