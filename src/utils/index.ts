/**
 * Parse the time to string
 * @param {(Date|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function parseDateTime(
  time?: Date | string | number,
  format = '{y}-{m}-{d} {h}:{i}:{s}'
): string | null {
  if (arguments.length === 0 || !time) {
    return null
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: {
    y: number
    m: number
    d: number
    h: number
    i: number
    s: number
    a: number
  } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(
    /{([ymdhisa])+}/g,
    (result, key: 'y' | 'm' | 'd' | 'h' | 'i' | 's' | 'a') => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      return value.toString().padStart(2, '0')
    }
  )
  return time_str
}

/**
 * get labe value from a list
 * @param list
 * @param value
 * @returns {string}
 */
export function getLabel(
  list?: {
    label: string
    value: string | number
  }[],
  value?: string | number
): string {
  const found = list?.find((item) => item.value === value)
  if (found) return found.label
  return ''
}

/**
 * 根据区码查找区名
 * @param list
 * @param value
 * @returns {string}
 */
export function getAreaNameByCode(list?: Option[], value?: number): string {
  if (Array.isArray(list)) {
    for (const item of list) {
      if (item.value === value) {
        return item.label
      } else if (item.children && item?.children?.length > 0) {
        return getAreaNameByCode(item.children, value)
      }
    }
  }
  return ''
}

/**
 * 简单深度拷贝
 * @param data
 * @returns {any}
 */
export function deepClone(data: object) {
  return JSON.parse(JSON.stringify(data))
}
