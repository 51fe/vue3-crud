import { createApp } from 'vue'
import './styles/index.scss'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import CN from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus, { locale: CN, size: 'default' })
app.mount('#app')