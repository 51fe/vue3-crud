export interface Receipt {
  id?: number
  date?: string
  userName?: string
  area?: number
  areaName?: string
  address?: string
  mobile?: string
}

export interface ReceiptQuery {
  userName_like?: string
  mobile_like?: string
  date_gte?: string
  date_lte?: string
  areaName_like?: string
  area_like?: string
  area?: string
}
