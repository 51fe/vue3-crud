<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect
} from 'vue'
import { ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { Receipt, ReceiptQuery } from './type/receipt'
import SearchForm from './components/SearchForm.vue'
import SaveForm from './components/SaveForm.vue'
import BasePagination from './components/BasePagination.vue'
import DateColumn from './components/DateColumn.vue'
import {
  addReceipt,
  delReceipt,
  editReceipt,
  getReceiptList
} from './api/receipt'
type FormKey = keyof Receipt
type SearchParams = Params & ReceiptQuery
const dialogVisible = ref(false)
const adding = ref(false)
const loading = ref(false)
const saveLoading = ref(false)
let form = reactive<Receipt>({})
const tableData = ref<Receipt[]>([])
const PAGE_SIZE = 15
const tableHeight = ref(0)
let params = reactive<Params>({
  _page: 1,
  _limit: PAGE_SIZE,
  _sort: 'id',
  _order: 'desc'
})
const total = ref(0)
const layout = ref()
const title = computed<string>(() => {
  if (adding.value) return '新增收货'
  return '编辑收货'
})

const fetchData = (params: SearchParams) => {
  loading.value = true
  getReceiptList(params)
    .then((data: PageTable<Receipt>) => {
      loading.value = false
      tableData.value = data.list ?? []
      total.value = data.total
    })
    .catch(() => {
      loading.value = false
    })
}

const handleSearch = (keyword?: ReceiptQuery) => {
  // merge params
  const value = {
    ...params,
    _page: 1,
    ...keyword
  }
  fetchData(value)
}

handleSearch()

// fetch first page data
const refresh = () => {
  params._page = 1
  fetchData(params)
}

watchEffect(() => {
  if (!saveLoading.value) {
    dialogVisible.value = false
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

const toEdit = (row: Receipt) => {
  adding.value = false
  dialogVisible.value = true
  form = Object.assign(form, row)
}

const toDelete = (id: number) => {
  ElMessageBox.confirm('确定删除?', {
    title: '提示',
    type: 'warning',
    confirmButtonText: '确定',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        delReceipt(id).then(() => {
          instance.confirmButtonLoading = false
          done()
          // not call fetchData
          const index = tableData.value.findIndex((item) => item.id === id)
          tableData.value.splice(index, 1)
          total.value -= 1
          if (total.value % params._limit === 0) {
            refresh()
          }
        })
      } else {
        done()
      }
    }
  })
}

const handleSubmit = (form: Receipt) => {
  if (adding.value) {
    doAdd(form)
  } else {
    doEdit(form)
  }
}

const doAdd = (params: Receipt) => {
  saveLoading.value = true
  addReceipt(params)
    .then(() => {
      saveLoading.value = false
      refresh()
    })
    .catch(() => {
      saveLoading.value = false
    })
}

const doEdit = (data: Receipt) => {
  saveLoading.value = true
  editReceipt(data)
    .then(() => {
      saveLoading.value = false
      // not call fetchData
      const index = tableData.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        tableData.value.splice(index, 1, data as Receipt)
      }
    })
    .catch(() => {
      saveLoading.value = false
    })
}

const responsive = () => {
  if (document.body.clientWidth < 768) {
    layout.value = 'prev, pager, next'
  } else {
    layout.value = undefined
  }
  const el = document.getElementById('searchForm') as HTMLElement
  tableHeight.value = document.body.clientHeight - el.clientHeight - 140
}

onMounted(() => {
  window.addEventListener('resize', debounce(responsive, 500))
  // not relayout when testing
  if (process.env.NODE_ENV !== 'test') {
    responsive()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', responsive)
})
</script>

<template>
  <div id="app">
    <SearchForm
      id="searchForm"
      @search="handleSearch"
    />
    <div class="box">
      <el-button
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
        新增
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :border="true"
      :height="tableHeight"
      class="main-table"
    >
      <DateColumn
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
        min-width="100"
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
        min-width="120"
      />
      <el-table-column
        v-if="tableData.length > 0"
        :fixed="layout ? 'right' : false"
        label="操作"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-tag
            type="warning"
            @click="toDelete(row.id)"
          >
            删除
          </el-tag>
          <el-tag @click="toEdit(row)">
            编辑
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :close-on-click-modal="false"
    >
      <SaveForm
        :value="form"
        :opened="dialogVisible"
        :loading="saveLoading"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
    <BasePagination
      v-model:page="params._page"
      v-model:limit="params._limit"
      :total="total"
      :layout="layout"
      @pagination="fetchData(params)"
    />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
