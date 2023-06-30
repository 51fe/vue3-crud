import {
  render,
  type RenderOptions,
  type RenderResult
} from '@testing-library/vue'

import ElementPlus from 'element-plus'

import CN from 'element-plus/lib/locale/lang/zh-cn'

export const customRender = (
  ui: unknown,
  overrides?: Omit<RenderOptions, 'global'>
): RenderResult => {
  return render(ui, {
    global: {
      plugins: [[ElementPlus, ...[{ locale: CN }]]]
    },
    ...overrides
  })
}
export { defineComponent, ref, reactive } from 'vue'
export * from '@testing-library/vue'
export { customRender as render }
export const sleep = (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time))
