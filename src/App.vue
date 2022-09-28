<script setup lang="ts">
import { IParams } from './type'
import { IForm, IQuery } from './type/receipt'
import { ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchForm from './components/SearchForm.vue'
import SaveForm from './components/SaveForm.vue'
import BasePagination from './components/BasePagination.vue'
import DateColumn from './components/DateColumn.vue'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import {
  addReceipt,
  delReceipt,
  editReceipt,
  getReceiptList
} from './api/receipt'
type FormKey = keyof IForm
type SearchParams = IParams & IQuery
const dialogVisible = ref(false)
let index = -1
const adding = ref(false)
const loading = ref(false)
const cudLoading = ref(false)
let form = reactive<IForm>({})
const tableData = ref<IForm[]>([])
let params = reactive<SearchParams>({
  _page: 1,
  _limit: 15,
  _sort: 'id',
  _order: 'desc'
})
const total = ref(0)
const layout = ref()
const title = computed<string>(() => {
  if (adding.value) return '新增收货'
  return '编辑收货'
})
watchEffect(() => {
  const loading = cudLoading.value
  if (!loading) {
    dialogVisible.value = false
  }
})

onMounted(() => {
  if (window.screen.width < 767) {
    layout.value = 'total, prev, pager, next'
  }
})

const toAdd = () => {
  adding.value = true
  dialogVisible.value = true
  // reset form
  Object.keys(form).forEach((item) => {
    const key = item as FormKey
    form[key] = undefined
  })
}

const toEdit = (row: IForm, idx: number) => {
  adding.value = false
  dialogVisible.value = true
  index = idx
  form = Object.assign(form, row)
}

const toDelete = (id: number, index: number) => {
  ElMessageBox.confirm('确定删除?', {
    type: 'warning'
  })
    .then(() => {
      doDelete(id, index)
    })
    .catch(() => {
      console.log('canceled')
    })
}
const fetchData = (params: SearchParams) => {
  loading.value = true
  getReceiptList(params)
    .then(({ data }) => {
      loading.value = false
      tableData.value = data.list ?? []
      total.value = data.total
    })
    .catch(() => {
      loading.value = false
    })
}
fetchData(params)
const handleSearch = (keyword: IQuery) => {
  // merge params
  params = {
    ...params,
    ...keyword
  }
  fetchData(params)
}

const doAdd = (params: IForm) => {
  cudLoading.value = true
  addReceipt(params)
    .then((data) => {
      cudLoading.value = false
      // not call fetchData
      tableData.value.unshift(data as IForm)
      total.value += 1
    })
    .catch(() => {
      cudLoading.value = false
    })
}

const doEdit = (params: IForm) => {
  cudLoading.value = true
  editReceipt(params)
    .then((data) => {
      cudLoading.value = false
      // not call fetchData
      tableData.value.splice(index, 1, data as IForm)
    })
    .catch(() => {
      cudLoading.value = false
    })
}

const doDelete = async (id: number, index: number) => {
  cudLoading.value = false
  delReceipt(id)
    .then(() => {
      cudLoading.value = false
      // not call fetchData
      tableData.value.splice(index, 1)
      total.value -= 1
    })
    .catch(() => {
      cudLoading.value = false
    })
}
const handleSubmit = () => {
  if (adding.value) {
    doAdd(form)
  } else {
    doEdit(form)
  }
}
</script>

<template>
  <div id="app">
    <search-form @search="handleSearch" />
    <div class="box">
      <el-button
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
        新增
      </el-button>
    </div>
    <section class="wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        :border="true"
      >
        <date-column
          prop="date"
          label="日期"
        />
        <el-table-column
          prop="userName"
          label="姓名"
          sortable
        />
        <el-table-column
          prop="areaName"
          label="省市区"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip
        />
        <el-table-column
          prop="mobile"
          label="手机号码"
          min-width="100"
        />
        <el-table-column
          v-if="tableData.length > 0"
          fixed="right"
          label="操作"
          width="120"
          align="center"
        >
          <template #default="{ row, $index }">
            <el-tag
              type="warning"
              @click="toDelete(row.id, $index)"
            >
              删除
            </el-tag>
            <el-tag
              @click="toEdit(row, $index)"
            >
              编辑
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :close-on-click-modal="false"
    >
      <save-form
        v-model="form"
        :opened="dialogVisible"
        :loading="cudLoading"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
    <base-pagination
      v-model:page="params._page"
      v-model:limit="params._limit"
      :total="total"
      :layout="layout"
      @pagination="fetchData(params)"
    />
  </div>
</template>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
</style>
