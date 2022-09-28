<script setup lang="ts">
import { computed } from 'vue'

export interface IOption {
  label: string
  value: number | string
}

type ValueType = number | string | number[] | string[]

const props = withDefaults(
  defineProps<{
    modelValue?: ValueType
    options: IOption[]
    multiple?: boolean
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请选择'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ValueType): void
}>()

const current = computed({
  get: () => {
    const value = props.modelValue
    if (value && typeof value === 'string') {
      if (props.multiple) {
        return value?.split(',')
      }
      const result = parseInt(value)
      if (!isNaN(result)) {
        return result
      }
    }
    return value
  },
  set: (value) => {
    emit('update:modelValue', value as ValueType)
  }
})
</script>

<template>
  <el-select
    v-model="current"
    :multiple="multiple"
    :placeholder="placeholder"
    filterable
    clearable
    class="base-select"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
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
