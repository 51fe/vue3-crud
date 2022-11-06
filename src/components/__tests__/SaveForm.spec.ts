import {
  fireEvent, screen, render, waitFor,
  within, defineComponent, reactive
} from '../../test-util'
import { rules } from '../../utils/validate'
import SaveForm from '../SaveForm.vue'

const initForm = {
  date: '2022-08-15 00:00:00',
  userName: '李四',
  area: 440305,
  areaName: '广东省深圳市南山区',
  address: '望海路33号',
  mobile: '15866666666'
}

const newForm = {
  date: '2022-08-16 00:00:00',
  userName: '王五',
  area: 440111,
  areaName: '广东省广州市白云区',
  address: '白云路100号',
  mobile: '15166666666'
}

test('fills and changes form fields correctly', async () => {
  const handleSubmit = jest.fn()
  const {
    getByRole,
    getByText,
    getAllByText,
    getByDisplayValue
  } = render(defineComponent({
    components: { SaveForm },
    setup() {
      const value = reactive(initForm)
      return {
        value,
        handleSubmit
      }
    },
    template: '<SaveForm :value="value" @submit="handleSubmit" />'
  }))

  const userNameInput = getByDisplayValue(initForm.userName)
  await fireEvent.update(userNameInput, newForm.userName)

  const addressInput = getByDisplayValue(initForm.address)
  await fireEvent.update(addressInput, newForm.address)

  const mobileInput = getByDisplayValue(initForm.mobile)
  await fireEvent.update(mobileInput, newForm.mobile)

  const date = initForm.date.substring(0, 10)
  getByDisplayValue(date)
  const day = newForm.date.substring(8, 10)
  const beginDay = getAllByText(day)[0]
  await fireEvent.click(beginDay)

  const areaCascader = getByDisplayValue('广东省 / 深圳市 / 南山区')
  // actives the dropdown menu by clicking the input
  await fireEvent.click(areaCascader)
  // emits the event when click the area
  await fireEvent.click(getByText(/广东省/))
  await fireEvent.click(getByText(/广州市/))
  await fireEvent.click(getByText(/白云区/))
  // Assert the right event has been emitted.
  await fireEvent.click(getByRole('button', { name: /确 定/ }))
  expect(newForm).toEqual(initForm)
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith(newForm)
  })
})

test('clear form fields before add', async () => {
  const { queryByText } = render(SaveForm, {
    props: {
      value: {},
      opened: true
    }
  })

  screen.getAllByRole('textbox').forEach(item => {
    expect(item).toHaveDisplayValue('')
  })

  for (const key in rules) {
    rules[key].forEach(item => {
      const errorMeg = queryByText(item.message as string)
      expect(errorMeg).toBeNull()
    })
  }
})

describe('validation', () => {
  const toSubmit = async (errMsg: string) => {
    // invalid
    await fireEvent.click(screen.getByRole('button', { name: /确 定/ }))
    expect(await screen.findByText(errMsg)).toBeVisible()
  }

  const checkInputValidation = async (name: string, value: string, errMsg: string) => {
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = screen.getByLabelText(name)
    await fireEvent.update(input, value)
    fireEvent.blur(input)
    await waitFor(() => {
      expect(screen.queryByText(errMsg)).toBeNull()
    })
  }
  test('validates inputs', async () => {
    render(SaveForm, {
      props: {
        value: {}
      }
    })
    await checkInputValidation('姓名', newForm.userName,
      rules.userName[0].message)
    await checkInputValidation('地址', newForm.address,
      rules.address[0].message)
    await checkInputValidation('手机号', newForm.mobile,
      rules.mobile[0].message)
  })

  test('validates phone format', async () => {
    const { getByLabelText, findByText, queryByText } =
      render(SaveForm, {
        props: {
          value: {}
        }
      })
    // invalid
    const item = getByLabelText(/手机号/)
    const input = within(item).getByRole('textbox')
    const errMsg = rules.mobile[1].message
    await fireEvent.update(input, 'abc')
    await fireEvent.click(screen.getByRole('button', { name: /确 定/ }))
    expect(await findByText(errMsg)).toBeVisible()
    // valid
    await fireEvent.update(input, newForm.mobile)
    await waitFor(() => {
      expect(queryByText(errMsg)).toBeNull()
    })
  })

  test('validates date', async () => {
    const { getByLabelText, queryByText } = render(SaveForm, {
      props: {
        value: {}
      }
    })
    const errMsg = rules.date[0].message
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = getByLabelText('日期')
    await fireEvent.focus(input)
    const cell = screen.getByRole('cell', { name: /15/ })
    await fireEvent.click(cell)
    await waitFor(() => {
      expect(queryByText(errMsg)).toBeNull()
    })
  })

  test('validates area', async () => {
    const { getByLabelText, getByText, queryByText } = render(SaveForm, {
      props: {
        value: {
          area: undefined
        }
      }
    })
    const errMsg = rules.area[0].message
    // invalid
    await toSubmit(errMsg)
    // valid
    const input = getByLabelText('市区')
    await fireEvent.click(input)
    await fireEvent.click(getByText('广东省'))
    await fireEvent.click(getByText('深圳市'))
    await fireEvent.click(getByText('南山区'))
    await waitFor(() => {
      expect(queryByText(errMsg)).toBeNull()
    })
  })
})
