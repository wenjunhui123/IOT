import './assets/main.css'
// 加载全局性的样式文件
import "./resources/index.scss";
import "./resources/tailwind.var.css";
// global css
import './styles/index.scss'
import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'virtual:svg-icons-register';

import {getJsonFile } from "./api/tools/utils"

import App from './App.vue'
import router from './router'

import i18n from '@/lang/index';


// 全局注册 状态管理(store)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)

const navmenu = await getJsonFile("static/assets/json/navmenu.json")
app.config.globalProperties.$navmenu = navmenu

app.use(i18n)

app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')


