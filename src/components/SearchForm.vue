<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import { ReceiptQuery } from '../type/receipt'
import { Search } from '@element-plus/icons-vue'
import area from '../components/AreaCascader/area'
import BaseInput from './BaseInput.vue'
import BaseDatePicker from './BaseDatePicker.vue'
import BaseSelect from './BaseSelect.vue'

const form: ReceiptQuery = reactive({})
const provinces = computed(() => {
  return area.map((item) => {
    return {
      label: item.label,
      value: item.label
    }
  })
})

let cities = ref<Option[]>([])
let areas = ref<Option[]>([])
const provice = toRef(form, 'areaName_like')
watch(provice, (newValue, oldValue) => {
  const children = area.find((item) => item.label === newValue)?.children
  if (children) {
    if (oldValue) {
      form.area_like = undefined
      form.area = undefined
      areas.value = []
      form.area = undefined
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
const city = toRef(form, 'area_like')
watch(city, (newValue, oldValue) => {
  if (newValue) {
    const children = cities.value.find(
      (item) => item.value === newValue
    )?.children
    if (children) {
      if (oldValue) {
        form.area = undefined
      }
      areas.value = children
    }
  }
})

const emit = defineEmits<{
  (e: 'search', query: ReceiptQuery): void;
}>()

const handleSearch = () => {
  emit('search', form)
}
</script>
<template>
  <dl
    class="search-form"
    data-testid="search-form"
    @keyup.enter="handleSearch"
  >
    <dd class="item">
      <BaseInput
        v-model="form.userName_like"
        placeholder="请输入姓名"
      />
      <BaseInput
        v-model="form.mobile_like"
        placeholder="请输入手机号"
      />
    </dd>
    <dd class="item date-item">
      <BaseDatePicker
        v-model="form.date_gte"
        placeholder="开始日期"
      />
      <BaseDatePicker
        v-model="form.date_lte"
        placeholder="结束日期"
      />
    </dd>
    <dd class="item">
      <BaseSelect
        v-model="form.areaName_like"
        :options="provinces"
        placeholder="请选择省"
      />
      <BaseSelect
        v-model="form.area_like"
        :options="cities"
        placeholder="请选择市"
      />
    </dd>
    <dd class="item">
      <BaseSelect
        v-model="form.area"
        :options="areas"
        placeholder="请选择区"
      />
      <el-button
        type="primary"
        plain
        :icon="Search"
        title="搜索"
        @click="handleSearch"
      />
    </dd>
  </dl>
</template>

<style lang="scss">
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
