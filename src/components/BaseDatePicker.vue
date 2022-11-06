<script setup lang="ts">
import { computed } from 'vue'

type ValueType = Date | string | number | undefined

const props = withDefaults(
  defineProps<{
    modelValue?: ValueType
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
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value as ValueType)
  }
})
</script>
<template>
  <el-date-picker
    v-model="current"
    value-format="YYYY-MM-DD HH:mm:ss"
    :placeholder="placeholder"
    clearable
    class="base-date-picker"
  />
</template>
<style lang="scss">
.base-date-picker {
  &.el-date-editor {
    &.el-input, .el-input__wrapper {
      width: 100%;
    }
  }
}
</style>
