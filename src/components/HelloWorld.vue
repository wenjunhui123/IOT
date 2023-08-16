<!-- src/components/HelloWorld.vue -->
<template>
    <el-card class="text-left text-white border-white border-1 border-solid mt-10 bg-[#242424]">
        <template #header> 子组件 HelloWorld.vue</template>
        <el-form>
            <el-form-item label="数字："> {{ counterStore.count }}</el-form-item>
            <el-form-item label="加倍："> {{ counterStore.doubleCount }}</el-form-item>
        </el-form>
    </el-card>
</template>


<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";
const counterStore = useCounterStore();
</script>

<style lang="scss" scoped>
.box {
    width: 100px;
    height: 100px;
    // background-color: $bg-color;
}
</style>
  