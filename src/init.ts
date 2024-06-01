import * as echarts from "echarts";
import { useSettingsStore } from "@/stores/modules/settings";
import { getJsonFile } from "@/api/tools/utils";
const settingsStore = useSettingsStore();
const theme = window.localStorage['vueuse-color-scheme'] === 'dark'? window.localStorage['vueuse-color-scheme']:settingsStore.theme
const linkDOM = document.createElement("link");
export default async function init() {
    const eleThemeUrl = `/static/theme/elementui-${theme}/theme/index.css`
    const echartsThemeUrl = `/static/theme/echarts-${theme}/index.json`
    const echartsConfig = await getJsonFile(echartsThemeUrl);
    echarts.registerTheme(theme, echartsConfig);
    const htmlDom: HTMLHtmlElement | null = document.querySelector('html')
    if (htmlDom) {
        htmlDom.className = theme;
    }
    linkDOM.type = "text/css";
    linkDOM.rel = "stylesheet";
    linkDOM.id = 'theme-color-id'
    document.head.insertBefore(linkDOM, document.head.firstChild || null);
    const link = new Promise(function (resolve, reject) {
        linkDOM.href = eleThemeUrl;
        linkDOM.onload = resolve;
        linkDOM.onerror = reject;
    })
    window.document.documentElement.setAttribute("data-theme", theme);
    settingsStore.changeSetting({ key: "theme", value: theme })  
}