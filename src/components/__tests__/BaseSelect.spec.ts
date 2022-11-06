import { fireEvent, screen, render } from '../../test-util'

import BaseSelect from '../BaseSelect.vue'

const options = [{
  value: 1,
  label: '移动'
}, {
  value: 2,
  label: '联通'
}, {
  value: 3,
  label: '电信'
}]

const defaultPlaceholder = '请选择'

const setUp = (overrides?: any) => {
  return render(BaseSelect, {
    props: {
      options,
      ...overrides
    }
  })
}

const getOptionByLabel = (label: string) => screen.getByRole('listitem', {
  hidden: true,
  name: (content, el) => el.textContent === label
})

test('renders correctly by default', async () => {
  const { html } = setUp()
  screen.getByPlaceholderText(defaultPlaceholder)
  options.forEach((item) => {
    getOptionByLabel(item.label)
  })
  const list = screen.getAllByRole('listitem', { hidden: true })
  expect(list).toHaveLength(options.length)
  expect(html()).toMatchSnapshot()
})

test('changes props correctly', async () => {
  const placeholder = '请选择营运商'
  const modelValue = 3
  setUp({
    placeholder,
    modelValue
  })
  // change placeholder and current selected
  await screen.findByPlaceholderText(placeholder)
  expect(getOptionByLabel('电信')).toHaveClass('selected')
})

test('emits input event correctly when selected', async () => {
  const { emitted } = setUp()
  //  trigger an update event by clicking the <option> element.
  await fireEvent.click(getOptionByLabel('电信'))
  expect(emitted()['update:modelValue'][0]).toEqual([3])
})

test('Passes and returns a string when select multiple items', async () => {
  const modelValue = '1, 2'
  const { emitted } = setUp({
    multiple: true,
    modelValue
  })
  // current selected 移动, 联通
  modelValue.split(',').forEach(id => {
    const found = options.find(item => item.value === parseInt(id))
    if (found) {
      getOptionByLabel(found.label)
    }
  })
  // select all
  await fireEvent.click(getOptionByLabel('电信'))
  expect(emitted()['update:modelValue'][0]).toEqual(['1,2,3'])
})




