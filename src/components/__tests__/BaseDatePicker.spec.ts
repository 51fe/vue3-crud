import { fireEvent, screen, render, within } from '../../test-util'
import { parseDateTime } from '../../utils/index'
import BaseDatePicker from '../BaseDatePicker.vue'

test('renders correctly by default', () => {
  render(BaseDatePicker)
  const picker = screen.getByPlaceholderText('请选择')
  expect(picker).toHaveValue('')
})

test('changes props correctly', async () => {
  const modelValue = '2022-08-15 00:00:00'
  const placeholder = '开始日期'
  render(BaseDatePicker, {
    props: {
      modelValue,
      placeholder
    }
  })
  // Placeholder
  const picker = screen.getByPlaceholderText(placeholder)
  await fireEvent.focus(picker)
  const dialog = await screen.findByRole('dialog')
  within(dialog).getByText(/2022 年/)
  within(dialog).getByText(/8 月/)
  const cell = within(dialog).getByRole('cell', { name: /15/ })
  expect(cell).toHaveClass('current')
})

test('emits input event correctly', async () => {
  const day = 15
  const { emitted } = render(BaseDatePicker)
  // opens the dropdown menu by focus the input
  await fireEvent.focus(screen.getByRole('textbox'))
  const today = new Date()
  const cell = screen.getByRole('cell', { name: String(day) })
  // emits the event when click the date button
  await fireEvent.click(cell)
  const selected = today.setDate(day) as number
  const dateTimeStr = parseDateTime(selected, '{y}-{m}-{d} 00:00:00')
  expect(emitted()['update:modelValue'][0]).toEqual([dateTimeStr])
})
