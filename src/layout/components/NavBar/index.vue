<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAppStore } from "@/stores/modules/app";
import Hamburger from "@/components/Hamburger/index.vue";
const appStore = useAppStore();

/**
 * 左侧菜单栏显示/隐藏
 */
function toggleSideBar() {
    appStore.toggleSidebar(true);
}
</script>

<template>
    <!-- 顶部导航栏 -->
    <div class="navbar">
        <!-- 左侧面包屑 -->
        <div class="flex">
            <Hamburger :is-active="appStore.sidebar.opened" @toggle-click="toggleSideBar" />
            <breadcrumb />
        </div>

        <!-- 右侧导航设置 -->
        <div class="flex">
            <NavRight />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background-color: #fff;
    box-shadow: 0 0 1px #0003;
}
</style>
