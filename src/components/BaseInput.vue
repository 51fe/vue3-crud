<script setup lang="ts">
import { computed } from 'vue'

type ValueType = string | number

const props = withDefaults(
  defineProps<{
    modelValue?: ValueType
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请输入'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: ValueType): void
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
  <el-input
    v-model="current"
    :max-length="200"
    :placeholder="placeholder"
    clearable
    class="base-input"
    @input="$emit('update:modelValue', $event)"
  />
</template>
<style>
.base-input {
  width: 100%;
}
</style>
