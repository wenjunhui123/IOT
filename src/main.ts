// import './assets/main.css'
// 加载全局性的样式文件
// import "./resources/index.scss";
// import "./resources/tailwind.var.css";
// global css

import { createApp } from "vue";
import { setupStore } from "@/stores";

import "@/permission";

import "virtual:svg-icons-register";

import { getJsonFile } from "./api/tools/utils";

import App from "./App.vue";
import router from "./router";

import i18n from "@/lang/index";

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import "@/styles/index.scss";
import "uno.css";
const app = createApp(App);

const navmenu = await getJsonFile("static/assets/json/navmenu.json");
app.config.globalProperties.$navmenu = navmenu;

app.use(i18n);

app.use(router);
// 全局注册 状态管理(store)
setupStore(app);

app.mount("#app");
