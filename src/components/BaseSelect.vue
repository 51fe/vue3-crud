<script setup lang="ts">
import { computed } from 'vue'

export interface BaseSelectProps {
  modelValue?: BaseValue
  options: Option[]
  multiple?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  modelValue: '',
  options: () => [],
  multiple: false,
  placeholder: '请选择'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: BaseValue): void
}>()

const toNumber = (str: string) =>
  isNaN?.(Number(str.trim())) ? str : Number(str.trim())

const current = computed({
  get: () => {
    const value = props.modelValue
    if (value && typeof value === 'string') {
      if (props.multiple) {
        return value.split(',').map((item) => toNumber(item))
      }
      return toNumber(value)
    }
    return value
  },
  set: (value) => {
    if (props.multiple && Array.isArray(value)) {
      value = value.join(',')
    }
    emit('update:modelValue', value as BaseValue)
  }
})
</script>

<template>
  <el-select
    id="baseSelect"
    v-model="current"
    :multiple="multiple"
    :placeholder="placeholder"
    filterable
    clearable
    class="base-select"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<style>
.base-select {
  width: 100%;
}
</style>
