<script setup lang="ts">
import { computed, ref } from 'vue'
import { CascaderNode } from 'element-plus'

import options from './area'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请选择'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: number): void
  (e: 'select', path: string[]): void
}>()

const current = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const config = ref({
  emitPath: false
})

const area = ref(null)
const handleChange = (value: number) => {
  emit('update:modelValue', value)
  // TODO
  const node = (area?.value as any).getCheckedNodes()?.[0] as CascaderNode
  if (node) {
    emit('select', [...new Set(node.pathLabels)])
  }
}
</script>

<template>
  <el-cascader
    ref="area"
    v-model="current"
    :props="config"
    :options="options"
    :placeholder="placeholder"
    filterable
    clearable
    class="area-cascader"
    @change="handleChange"
  />
</template>

<style>
.area-cascader {
  width: 100%;
}
</style>
