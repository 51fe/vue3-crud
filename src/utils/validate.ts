/**
 * phone niumber validator
 * @param rule
 * @param value
 * @param callback
 */
export function mobileValidator(
  rule: unknown,
  value: string,
  callback: (e?: Error) => void
) {
  const reg = /^[1][345789][0-9]{9}$/
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

export default {
  mobileValidator
}
