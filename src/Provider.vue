<script lang="ts" setup>
import './styles/index.scss'
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue';
</script>

<template>
<el-config-provider :locale="zhCn">
  <App />
</el-config-provider>
</template>