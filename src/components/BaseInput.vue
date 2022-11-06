<script setup lang="ts">

withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请输入'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()
</script>
<template>
  <el-input
    :model-value="modelValue"
    :max-length="200"
    :placeholder="placeholder"
    clearable
    class="base-input"
    @input="emit('update:modelValue', $event)"
  />
</template>
<style>
.base-input {
  width: 100%;
}
</style>
