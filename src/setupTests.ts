// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  // vi.spyOn(console, 'log').mockImplementation(() => {})
})
