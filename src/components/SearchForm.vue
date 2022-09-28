<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import { IQuery } from '../type/receipt'
import { Search } from '@element-plus/icons-vue'
import area from '../components/AreaCascader/area'
import BaseDatePicker from './BaseDatePicker.vue'
import BaseSelect, { IOption } from './BaseSelect.vue'

interface ICity extends IOption {
  children?: IOption[]
}

const query: IQuery = reactive({})
const provinces = computed(() => {
  return area.map((item) => {
    return {
      label: item.label,
      value: item.label
    }
  })
})

let cities = ref<ICity[]>([])
let areas = ref<IOption[]>([])
const provice = toRef(query, 'areaName_like')
watch(provice, (newValue, oldValue) => {
  const children = area.find((item) => item.label === newValue)?.children
  if (children) {
    if (oldValue) {
      query.area_like = undefined
      query.area = undefined
      areas.value = []
      query.area = undefined
    }
    cities.value = children?.map((item) => {
      return {
        label: item.label,
        value: Math.floor(item.value / 100),
        children: item.children
      }
    })
  }
})
const city = toRef(query, 'area_like')
watch(city, (newValue, oldValue) => {
  if (newValue) {
    const children = cities.value.find(
      (item) => item.value === newValue
    )?.children
    if (children) {
      if (oldValue) {
        query.area = undefined
      }
      areas.value = children
    }
  }
})

const emit = defineEmits<{
  (e: 'search', query: IQuery): void
}>()
</script>
<template>
  <dl class="search-form">
    <dd class="item">
      <el-input
        v-model="query.userName_like"
        placeholder="请输入姓名"
        clearable
      />
      <el-input
        v-model="query.mobile_like"
        placeholder="请输入手机号"
        clearable
      />
    </dd>
    <dd class="item date-item">
      <base-date-picker
        v-model="query.date_gte"
        placeholder="开始日期"
      />
      <base-date-picker
        v-model="query.date_lte"
        placeholder="结束日期"
      />
    </dd>
    <dd class="item">
      <base-select
        v-model="query.areaName_like"
        :options="provinces"
        placeholder="请选择省"
      />
      <base-select
        v-model="query.area_like"
        :options="cities"
        placeholder="请选择市"
      />
    </dd>
    <dd class="item">
      <base-select
        v-model="query.area"
        :options="areas"
        placeholder="请选择区"
      />
      <el-button
        type="primary"
        plain
        :icon="Search"
        @click="emit('search', query)"
      />
    </dd>
  </dl>
</template>

<style lang="less">
.search-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  .item {
    margin-right: 10px;
    margin-bottom: 10px;

    .el-input,
    .base-select,
    .base-date-picker {
      width: 140px;
    }

    .el-input+.el-input {
      margin-left: 10px;
    }

    .base-select+.base-select {
      margin-left: 10px;
    }

    .el-button {
      margin-left: 20px;
    }
  }
}

@media screen and (max-width: 767px) {
  .search-form {
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .el-input,
      .base-select {
        width: 100%;
      }
    }
  }
}
</style>
