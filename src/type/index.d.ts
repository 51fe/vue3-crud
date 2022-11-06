import { RuleItem } from 'async-validator'

export {}
declare global {
  type BaseValue = string | number

  type SelectValue = BaseValue | BaseValue[]
  
  interface Option {
    label: string
    value: BaseValue
    children?: Omit<Option, 'children'>[];
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
  
  interface FormItemRule extends RuleItem {
    message: string
    trigger?: string | string[];
  }
} 