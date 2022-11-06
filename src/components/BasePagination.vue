<script setup lang="ts">
import { computed } from 'vue'
import { scrollTo } from '../utils/scroll-to'

const props = withDefaults(
  defineProps<{
    total: number
    page: number
    limit: number
    layout?: string
    background?: boolean
    autoScroll?: boolean
    hidden?: boolean
  }>(),
  {
    total: 0,
    page: 1,
    limit: 15,
    layout: 'total, sizes, prev, pager, next, jumper',
    autoScroll: true
  }
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:limit', value: number): void
  (e: 'pagination', value: number): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get: () => props.limit,
  set: (val) => {
    emit('update:limit', val)
  }
})

function handleSizeChange(val: number) {
  emit('pagination', val)
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val: number) {
  emit('pagination', val)
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<template>
  <div
    :class="{ hidden: hidden }"
    class="pagination-container"
  >
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :layout="layout"
      :page-sizes="[15, 30, 50, 100]"
      :total="total"
      :background="background"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss">
.pagination-container {
  display: flex;
  clear: both;
  background: #fff;
  .el-pagination {
    margin: 20px auto;
  }
  .hidden {
    display: none;
  }
}
</style>
