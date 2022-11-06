import { fireEvent, screen, render } from '../../test-util'

import BaseInput from '../BaseInput.vue'

test('renders correctly by default', () => {
  const { html, getByPlaceholderText } = render(BaseInput)
  getByPlaceholderText('请输入')
  expect(html()).toMatchSnapshot()
})

test('changes props correctly', () => {
  const modelValue = 'hello'
  const placeholder = '请输入姓名'
  render(BaseInput, {
    props: {
      modelValue,
      placeholder
    }
  })
  screen.getByPlaceholderText(placeholder)
  screen.getByDisplayValue(modelValue)
})

test('emits input event correctly', async () => {
  const { emitted } = render(BaseInput)
  const value = 'world'
  const input = screen.getByRole('textbox')
  await fireEvent.update(input, value)
  expect(emitted()['update:modelValue']).toEqual([[value]])
})