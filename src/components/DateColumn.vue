<script setup lang="ts">
import { parseDateTime } from '../utils'

withDefaults(
  defineProps<{
    format?: string
  }>(),
  {
    format: '{y}-{m}-{d}'
  }
)
</script>

<template>
  <el-table-column
    v-bind="$attrs"
    min-width="90"
    sortable
    show-overflow-tooltip
  >
    <template #default="scope">
      {{ parseDateTime(scope.row[$attrs.prop as string], format) }}
    </template>
  </el-table-column>
</template>
