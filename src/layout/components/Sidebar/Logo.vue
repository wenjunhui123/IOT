<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { useSettingsStore } from "@/stores/modules/settings";
import { ref } from "vue";

const settingsStore = useSettingsStore();

defineProps({
    collapse: {
        type: Boolean,
        required: true,
    },
});

const logo = ref(new URL(`../../../assets/logo.png`, import.meta.url).href);
</script>

<template>
    <div class="w-full h-[50px] bg-BG1 dark:bg-[var(--BG1)] logo-wrap">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="h-full w-full flex items-center justify-center" to="/">
                <img v-if="settingsStore.sidebarLogo" :src="logo" alt="logo" class="w-5 h-5" />
                <span v-else class="ml-3 text-T2 text-sm font-bold">IOT物联网平台</span>
            </router-link>

            <router-link v-else key="expand" class="h-full w-full flex items-center justify-center" to="/">
                <img v-if="settingsStore.sidebarLogo" :src="logo" alt="logo" class="w-5 h-5" />
                <span class="ml-3 text-T2 text-sm font-bold">IOT物联网平台</span>
            </router-link>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
.sidebarLogoFade-enter-active {
    transition: opacity 2s;
}

.sidebarLogoFade-leave-active,
.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
    opacity: 0;
}
</style>
