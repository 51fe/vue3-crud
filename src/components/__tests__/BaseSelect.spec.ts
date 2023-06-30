import { fireEvent, screen, render } from '../../test-util'

import BaseSelect from '../BaseSelect.vue'

const options = [
  {
    value: 1,
    label: '移动'
  },
  {
    value: 2,
    label: '联通'
  },
  {
    value: 3,
    label: '电信'
  }
]

const setUp = (overrides?: any) => {
  return render(BaseSelect, {
    props: {
      options,
      ...overrides
    }
  })
}

const selectMultiple = (arr: string[] = []) => {
  arr.forEach(async (tag) => {
    expect(
      await screen.findByText(tag, { selector: '.el-select__tags-text' })
    ).toBeInTheDocument()
  })
}

test('renders correctly by default', async () => {
  const { html } = setUp()
  screen.getByPlaceholderText('请选择')
  await fireEvent.click(screen.getByRole('textbox'))
  expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(
    options.length
  )
  expect(html()).toMatchSnapshot()
})

test('changes props and emits input event correctly', async () => {
  const placeholder = '请选择营运商'
  const { emitted, rerender } = setUp({
    placeholder,
    modelValue: 2
  })
  const inputEl = screen.getByRole('textbox')
  // change placeholder and current selected
  await screen.findByPlaceholderText(placeholder)
  expect(inputEl).toHaveValue('联通')

  //  trigger an update event by clicking the <option> element.
  await fireEvent.click(inputEl)
  await fireEvent.click(screen.getAllByRole('listitem', { hidden: true })[2])
  expect(emitted()['update:modelValue'][0]).toEqual([3])
  // select 电信
  await rerender({ modelValue: 3 })
  expect(inputEl).toHaveValue('电信')
})

test('Passes and returns a string when select multiple items', async () => {
  const { emitted, rerender } = setUp({
    multiple: true,
    modelValue: '1, 2'
  })
  // current selected 移动, 联通
  selectMultiple(['移动', '联通'])
  // add the last one
  await fireEvent.click(screen.getAllByRole('textbox')[0])
  await fireEvent.click(screen.getAllByRole('listitem', { hidden: true })[2])
  expect(emitted()['update:modelValue'][0]).toEqual(['1,2,3'])
  // select all
  await rerender({ modelValue: '1,2,3' })
  selectMultiple(['移动', '联通', '电信'])
})
