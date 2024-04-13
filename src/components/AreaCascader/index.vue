<script setup lang="ts">
import { computed, ref } from 'vue'
import { CascaderNode } from 'element-plus'

import options from './area'

const props = withDefaults(
  defineProps<{
    modelValue: number
    placeholder?: string
  }>(),
  {
    modelValue: undefined,
    placeholder: '请选择'
  }
)

const config = ref({
  emitPath: false
})

const areaRef = ref()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: number): void
  (e: 'select', path: string[]): void
}>()

const current = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    emit('update:modelValue', value!)
    const node = areaRef.value.getCheckedNodes()[0] as CascaderNode
    if (node) {
      emit('select', [...Array.from(new Set(node.pathLabels))])
    }
  }
})
</script>

<template>
  <el-cascader
    ref="areaRef"
    v-model="current"
    :props="config"
    :options="options"
    :placeholder="placeholder"
    filterable
    clearable
    class="area-cascader"
  />
</template>

<style>
.area-cascader {
  width: 100%;
}
</style>
