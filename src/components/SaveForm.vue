<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { Receipt } from '../type/receipt'
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { rules } from '../utils/validate'
import AreaCascader from './AreaCascader/index.vue'
import BaseInput from './BaseInput.vue'
import BaseDatePicker from './BaseDatePicker.vue'

const props = defineProps<{
  value: Receipt
  loading?: boolean
  opened?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', value: Receipt): void
  (e: 'cancel'): void
}>()

let form = reactive(props.value)
const position = ref<'left' | 'right' | 'top'>('right')
const ruleFormRef = ref<FormInstance>()

onMounted(() => {
  if (window.screen.width < 767) {
    position.value = 'top'
  }
})

watchEffect(() => {
  const opened = props.opened
  if (opened) {
    nextTick(() => {
      ruleFormRef.value!.clearValidate()
    })
  }
})

const handleSubmit = () => {
  ruleFormRef.value!.validate((valid) => {
    if (valid) {
      emit('submit', form)
    }
  })
}
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    class="save-form"
    :label-position="position"
  >
    <el-form-item
      label="日期"
      prop="date"
    >
      <BaseDatePicker v-model="form.date" />
    </el-form-item>
    <el-form-item
      label="姓名"
      prop="userName"
    >
      <BaseInput v-model="form.userName" />
    </el-form-item>
    <el-form-item
      label="市区"
      prop="area"
    >
      <AreaCascader
        v-model="form.area"
        @select="form.areaName = $event.join('')"
      />
    </el-form-item>
    <el-form-item
      label="地址"
      prop="address"
    >
      <BaseInput v-model="form.address" />
    </el-form-item>
    <el-form-item
      label="手机号"
      prop="mobile"
    >
      <BaseInput v-model="form.mobile" />
    </el-form-item>
    <el-form-item class="footer-item">
      <el-button @click="emit('cancel')">
        取 消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss">
.save-form {
  .el-input {
    width: 100%;
  }

  .footer-item {
    margin-bottom: 0;

    .el-form-item__content {
      justify-content: flex-end;
    }
  }
}
</style>
