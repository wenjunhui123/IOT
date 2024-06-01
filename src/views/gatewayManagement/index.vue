<template>
  <div>
    <MainTable
      ref="mainTableRef"
      v-show="isShowMainTable"
      @infoEvent="infoEvent"
    ></MainTable>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import MainTable from "./components/MainTable.vue";
defineOptions({
  name: "GatewayManagement",
  inheritAttrs: false,
});

const mainTableRef = ref<any>(null);

const isShowMainTable = ref<boolean>(true);
function infoEvent(type: string, id: number) {}

router.beforeEach((to, from, next) => {
  if (to.path === "/gateway/management") {
    nextTick(() => {
      mainTableRef.value.isShowDetail = false;
      mainTableRef.value.isShowEditForward = false;
      //   mainTableRef.value.refreashMainData();
    });
  }
  next();
});
</script>
<style lang="scss" scoped></style>
