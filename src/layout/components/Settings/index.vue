<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import * as echarts from "echarts";
import { useSettingsStore } from "@/stores/modules/settings";
import { ref, onMounted } from "vue";
import { useDark } from "@vueuse/core";
import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";
import { getJsonFile } from "@/api/tools/utils";

/**
 * 暗黑模式
 */
const settingsStore = useSettingsStore();
const isDark = useDark();
const linkDOM = document.querySelector("#theme-color-id");
const toggleDark = async () => {
  useToggle(isDark);
  const theme = isDark.value ? "dark" : "light";
  const eleThemeUrl = `/static/theme/elementui-${theme}/theme/index.css`;
  const echartsThemeUrl = `/static/theme/echarts-${theme}/index.json`;
  const echartsConfig = await getJsonFile(echartsThemeUrl);
  echarts.registerTheme(theme, echartsConfig);
  const htmlDom: HTMLHtmlElement | null = document.querySelector("html");
  if (htmlDom) {
    htmlDom.className = theme;
  }
  linkDOM.type = "text/css";
  linkDOM.rel = "stylesheet";
  document.head.insertBefore(linkDOM, document.head.firstChild || null);
  const link = new Promise(function (resolve, reject) {
    linkDOM.href = eleThemeUrl;
    linkDOM.onload = resolve;
    linkDOM.onerror = reject;
  });
  window.document.documentElement.setAttribute("data-theme", theme);
  settingsStore.changeSetting({ key: "theme", value: theme });
};

/**
 * 切换布局
 */
function changeLayout(layout: string) {
  settingsStore.changeSetting({ key: "layout", value: layout });
  window.document.body.setAttribute("layout", settingsStore.layout);
}

/**
 * 切换主题颜色
 */
function changeThemeColor(color: string) {
  document.documentElement.style.setProperty("--el-color-primary", color);
}

onMounted(() => {
  window.document.body.setAttribute("layout", settingsStore.layout);
});
</script>

<template>
  <div class="settings-container">
    <h3 class="text-base font-bold">项目配置</h3>
    <el-divider>主题</el-divider>

    <div class="flex justify-center" @click.stop>
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
        @change="toggleDark"
      />
    </div>

    <el-divider>界面设置</el-divider>
    <div class="py-[8px] flex justify-between">
      <span class="text-xs">开启 Tags-View</span>
      <el-switch v-model="settingsStore.tagsView" />
    </div>

    <div class="py-[8px] flex justify-between">
      <span class="text-xs">侧边栏 Logo</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>

    <el-divider>导航设置</el-divider>

    <ul class="layout">
      <el-tooltip content="左侧模式" placement="bottom">
        <li
          :class="
            'layout-item layout-left ' +
            (settingsStore.layout === 'left' ? 'is-active' : '')
          "
          @click="changeLayout('left')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>
      <el-tooltip content="顶部模式" placement="bottom">
        <li
          :class="
            'layout-item layout-top ' +
            (settingsStore.layout === 'top' ? 'is-active' : '')
          "
          @click="changeLayout('top')"
        >
          <div></div>
          <div></div>
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  padding: 16px;

  .layout {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    height: 50px;

    &-item {
      position: relative;
      width: 18%;
      height: 45px;
      overflow: hidden;
      cursor: pointer;
      background: #f0f2f5;
      border-radius: 4px;
    }

    &-item.is-active {
      border: 2px solid var(--el-color-primary);
    }

    &-mix div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-mix div:nth-child(2) {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30%;
      height: 70%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-top div:nth-child(1) {
      width: 100%;
      height: 30%;
      background: #1b2a47;
      box-shadow: 0 0 1px #888;
    }

    &-left div:nth-child(1) {
      width: 30%;
      height: 100%;
      background: #1b2a47;
    }

    &-left div:nth-child(2) {
      position: absolute;
      top: 0;
      right: 0;
      width: 70%;
      height: 30%;
      background: #fff;
      box-shadow: 0 0 1px #888;
    }
  }
}
</style>
