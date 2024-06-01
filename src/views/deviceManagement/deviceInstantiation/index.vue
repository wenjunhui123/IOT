<template>
  <div>
    <MainTable
      ref="mainTableRef"
      v-show="isShowMainTable"
      @infoEvent="infoEvent"
    ></MainTable>
    <InfoDetail
      ref="infoDetailRef"
      v-show="isShowInfo"
      :deviceId="deviceId"
      :isShowInfo="isShowInfo"
      @infoEvent="infoEvent"
    ></InfoDetail>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import MainTable from "./components/MainTable.vue";
import InfoDetail from "./components/InfoDetail.vue";

defineOptions({
  name: "DeviceInstantiation",
  inheritAttrs: false,
});

const infoDetailRef = ref<any>(null);
const mainTableRef = ref<any>(null);
const isShowMainTable = ref<boolean>(true);
const isShowInfo = ref<boolean>(false);
function infoEvent(type: string, id: number) {
  if (type === "info") {
    isShowMainTable.value = false;
    isShowInfo.value = true;
    deviceId.value = id;
  } else if (type === "main" || type === "refresh") {
    if (type === "main") {
      isShowMainTable.value = true;
      isShowInfo.value = false;
    }
    if (mainTableRef.value.currentNode?.modelLabel === "all") {
      mainTableRef.value.initData();
    } else if (mainTableRef.value.currentNode?.modelLabel === "station") {
      mainTableRef.value.initData(
        "station",
        mainTableRef.value.currentNode?.nodeId
      );
    } else if (mainTableRef.value.currentNode?.modelLabel === "channel") {
      mainTableRef.value.initData(
        "channel",
        mainTableRef.value.currentNode?.nodeId
      );
    } else {
      mainTableRef.value.initData();
    }

    // mainTableRef.value.initData();
  }
}

const deviceId = ref<number>(0);
provide("deviceId", deviceId);

router.beforeEach((to, from, next) => {
  nextTick(() => {
    if (to.path === "/deviceManagement/deviceInstantiation") {
      isShowMainTable.value = true;
      isShowInfo.value = false;
      mainTableRef.value.currentPage = 1;
      mainTableRef.value.pageSize = 10;
      //   mainTableRef.value.refreshMainTable();
      //   mainTableRef.value.initData();
    }
  });
  next();
});
</script>

<style lang="scss" scoped></style>
