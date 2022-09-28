export interface ITable<T> {
  list: Array<T>
  total: number
}

export interface IParams {
  _page: number
  _limit: number
  _sort: string
  _order: string
}
