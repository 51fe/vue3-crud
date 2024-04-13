import { RuleItem } from 'async-validator'

export {}

declare global {
  type EmptyObject = Record<string, never>
  type BaseValue = string | number

  interface Option {
    label: string
    value: BaseValue
    children?: Omit<Option, 'children'>[]
  }

  interface PageTable<T> {
    list: Array<T>
    total: number
  }

  interface Params {
    _page: number
    _limit: number
    _sort: string
    _order: string
  }

  interface Rule extends RuleItem {
    message: string
    trigger?: string | string[]
  }
}
