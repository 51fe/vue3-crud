<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { IForm } from '../type/receipt'
import { computed, nextTick, ref, watchEffect } from 'vue'
import { mobileValidator } from '../utils/validate'
import AreaCascader from './AreaCascader/index.vue'
import BaseInput from './BaseInput.vue'
import BaseDatePicker from './BaseDatePicker.vue'

const ruleFormRef = ref<FormInstance>()

const props = defineProps<{
  modelValue?: IForm;
  loading?: boolean;
  opened?: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IForm): void;
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>()

const form = computed({
  get: () => {
    return props.modelValue as IForm
  },
  set: (value) => {
    emit('update:modelValue', value as IForm)
  }
})

watchEffect(() => {
  const opened = props.opened
  if (opened) {
    nextTick(() => {
      ruleFormRef.value?.clearValidate()
    })
  }
})

const handleSubmit = (formEl: FormInstance | undefined) => {
  formEl?.validate((valid) => {
    if (valid) {
      emit('submit')
    }
  })
}
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    label-width="80px"
    class="save-form"
  >
    <el-form-item
      :rules="[{ required: true, message: '日期不能为空' }]"
      label="日期"
      prop="date"
    >
      <base-date-picker
        v-model="form.date"
        placeholder="请选择"
      />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]"
      label="姓名"
      prop="userName"
    >
      <base-input v-model="form.userName" />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '市区不能为空' }]"
      label="市区"
      prop="area"
    >
      <area-cascader
        v-model="form.area"
        @select="form.areaName = $event.join('')"
      />
    </el-form-item>
    <el-form-item
      :rules="[{ required: true, message: '地址不能为空', trigger: 'blur' }]"
      label="地址"
      prop="address"
    >
      <base-input
        v-model="form.address"
        placeholder="请输入"
        clearable
      />
    </el-form-item>
    <el-form-item
      :rules="[
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { validator: mobileValidator }
      ]"
      label="手机号"
      prop="mobile"
    >
      <base-input
        v-model.number="form.mobile"
        placeholder="请输入"
        clearable
      />
    </el-form-item>
    <el-form-item class="footer-item">
      <el-button @click="emit('cancel')">
        取 消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit(ruleFormRef)"
      >
        确 定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less">
.save-form {
  .el-input {
    width: 100%;
  }

  .footer-item {
    .el-form-item__content {
      justify-content: flex-end;
    }
  }
}
</style>
