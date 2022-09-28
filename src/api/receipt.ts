import { AxiosResponse } from 'axios'
import { IParams, ITable } from '../type'
import { IForm, IQuery } from '../type/receipt'
import request from '../utils/request'

export function getReceiptList(
  params: IParams & IQuery
): Promise<AxiosResponse<ITable<IForm>>> {
  return request({
    url: '/receipts',
    method: 'get',
    params
  })
}

// 新增
export function addReceipt(data: IForm) {
  return request({
    url: '/receipts',
    method: 'POST',
    data
  })
}

// 修改
export function editReceipt(data: IForm) {
  const { id } = data
  return request({
    url: `/receipts/${id}`,
    method: 'PUT',
    data
  })
}

// 删除
export function delReceipt(id: number) {
  return request({
    url: `/receipts/${id}`,
    method: 'DELETE'
  })
}
