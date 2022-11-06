import { Receipt } from '../type/receipt'
import request from '../utils/request'

export function getReceiptList(params: Params): Promise<any> {
  return request({
    url: '/receipts',
    method: 'get',
    params
  })
}

// 新增
export function addReceipt(data: Receipt): Promise<any> {
  return request({
    url: '/receipts',
    method: 'POST',
    data
  })
}

// 修改
export function editReceipt(data: Receipt): Promise<any> {
  const { id } = data
  return request({
    url: `/receipts/${id}`,
    method: 'PUT',
    data
  })
}

// 删除
export function delReceipt(id: number): Promise<any> {
  return request({
    url: `/receipts/${id}`,
    method: 'DELETE'
  })
}

const receiptApi = {
  getReceiptList,
  addReceipt,
  editReceipt,
  delReceipt
}

export default receiptApi