/* eslint-env node */
module.exports = {
  root: true,
  env: {
    jest: true,
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    Params: true,
    PageTable: true,
    FormItemRule: true,
    Option: true,
    SelectValue: true,
    BaseValue: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: ['warn', 'never'],
    quotes: ['warn', 'single'],
    'comma-dangle': ['error', 'never'],
    'vue/multi-word-component-names': ['off']
  }
}