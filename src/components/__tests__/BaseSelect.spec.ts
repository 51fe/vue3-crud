import { fireEvent, screen, render, waitFor } from '../../test-util'

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
  await fireEvent.click(screen.getByRole('combobox'))
  expect(screen.getAllByRole('option')).toHaveLength(
    options.length
  )
  expect(html()).toMatchSnapshot()
})

test('changes props and emits input event correctly', async () => {
  const placeholder = '请选择营运商'
  const { emitted, rerender, container } = setUp({
    placeholder,
    modelValue: 2
  })
  await waitFor(() => {
    expect(container.querySelector('.el-select__placeholder')).toHaveTextContent('联通')
  })
  //  trigger an update event by clicking the <option> element.
  await fireEvent.click(screen.getByRole('combobox'))
  const selectedOption = screen.getByRole('option', { name: '电信' })
  await fireEvent.click(selectedOption)
  expect(emitted()['update:modelValue'][0]).toEqual([3])
  // select 电信
  await rerender({ modelValue: 3 })
  expect(selectedOption).toHaveClass('is-selected')
})

test('Passes and returns a string when select multiple items', async () => {
  const { emitted, rerender } = setUp({
    multiple: true,
    modelValue: '1, 2'
  })
  // current selected 移动, 联通
  selectMultiple(['移动', '联通'])
  // add the last one
  await fireEvent.click(screen.getByRole('combobox'))
  await fireEvent.click(screen.getByText('电信'))
  expect(emitted()['update:modelValue'][0]).toEqual(['1,2,3'])
  // select all
  await rerender({ modelValue: '1,2,3' })
  selectMultiple(['移动', '联通', '电信'])
})
