import { fireEvent, screen, render } from '../../../test-util'
import AreaCascader from '../index.vue'

test('renders correctly by default', () => {
  render(AreaCascader)
  screen.getByPlaceholderText('请选择')
})

test('changes props correctly', async () => {
  const placeholder = '请选择区域'
  render(AreaCascader, {
    props: {
      modelValue: 110105, //朝阳区
      placeholder
    }
  })
  // Updates props by manually sending a valid option value.
  screen.getByPlaceholderText(placeholder)
  expect(screen.getAllByText(/北京市/)).toHaveLength(2)
  screen.findByText(/朝阳区/)
})

test('emits input and select event correctly', async () => {
  const { emitted } = render(AreaCascader)
  const areas = ['广东省', '深圳市', '南山区']
  // actives the dropdown menu by clicking the input
  await fireEvent.click(screen.getByRole('textbox'))
  // emits the event by clicking the area
  await fireEvent.click(screen.getByText(areas[0]))
  await fireEvent.click(screen.getByText(areas[1]))
  await fireEvent.click(screen.getByText(areas[2]))
  expect(emitted()['update:modelValue'][0]).toEqual([440305]) // 南山区
  expect(emitted().select[0]).toEqual([areas])
})
