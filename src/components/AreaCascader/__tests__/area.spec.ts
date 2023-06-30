import areas from '../area'

const provinces = areas as Option[]

test('have 23 provinces and every province code ends with 0000', async () => {
  expect(provinces).toHaveLength(34)
  expect(
    provinces.every((province) => /\d{2}0000/.test(String(province.value)))
  ).toBeTruthy()
})

test('check relations between province/ city/ area code', async () => {
  provinces.forEach((province) => {
    const cities = province?.children as Option[]
    cities?.forEach((city) => {
      const cityCode = city.value as number
      // The first four digits of a city code are same as the relevant province's
      expect(Math.floor(cityCode / 10000) * 10000).toBe(province.value)
      expect(/\d{4}00/.test(String(cityCode))).toBeTruthy()
      city?.children?.forEach((area) => {
        const areaCode = area.value as number
        // The first four digits of an area code are same as the relevant city's
        expect(Math.floor(areaCode / 100) * 100).toBe(city.value)
      })
    })
  })
})
