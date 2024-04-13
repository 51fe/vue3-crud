import { type Receipt } from '../type/receipt'
import http from '../utils/http'

const url = '/receipts'

export const getReceiptList = (params?: Params) =>
  http.get<PageTable<Receipt>>(url, { params })

// 新增
export const addReceipt = (data: Receipt) => http.post<Receipt>(url, data)

// 修改
export const editReceipt = (data: Receipt) =>
  http.put<Receipt>(`${url}/${data?.id}`, data)

// 删除
export const delReceipt = (id: number) => http.delete(`${url}/${id}`)

const receiptApi = {
  getReceiptList,
  addReceipt,
  editReceipt,
  delReceipt
}

export default receiptApi
