<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useCounterStore } from "@/stores/counter";
const counterStore = useCounterStore();
import { ElConfigProvider } from 'element-plus';
import pinia from '@/stores/store'
import { useAppStore } from '@/stores/modules/app';
const appStore = useAppStore(pinia);
</script>

<template>
  <!-- <div id="appContent">
        <el-button type="success"><i-ep-SuccessFilled />Success</el-button>
        <el-button type="info"><svg-icon icon-class="layout_user" />SVG 本地图标</el-button>
        <el-icon color="#409EFC" class="no-inherit">
            <Share />
        </el-icon>
        <el-button type="primary" @click="counterStore.increment">count++</el-button>
        <HelloWorld msg="Hello Vue 3.0 + Vite + TypeScript + Element Plus" />
        <nav>
            <RouterLink to="/111">Home</RouterLink> |
            <RouterLink to="/login">login</RouterLink>
        </nav>
    </div> -->
  <!-- <router-view /> -->
  <el-config-provider :locale="appStore.locale">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>
