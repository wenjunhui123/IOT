<template>
  <div>
    <MainTable
      ref="mainTableRef"
      v-show="isShowMainTable"
      :isShowMainTable="isShowMainTable"
      @infoEvent="infoEvent"
    ></MainTable>
    <InfoDetail
      ref="infoDetailRef"
      v-show="isShowInfo"
      :isShowInfo="isShowInfo"
      :productId="productId"
      @infoEvent="infoEvent"
    ></InfoDetail>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/product";
const productStore = useProductStore();
import MainTable from "./components/MainTable.vue";
import InfoDetail from "./components/InfoDetail.vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

defineOptions({
  name: "ProductManagement",
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
    productId.value = id;
    if (infoDetailRef.value.activeName) {
      infoDetailRef.value.activeName = "real-time-measure-points";
    }
  } else if (type === "main") {
    isShowMainTable.value = true;
    isShowInfo.value = false;
    mainTableRef.value.init();
  } else if (type === "refreshMain") {
    // isShowMainTable.value = true;
    // isShowInfo.value = false;
    mainTableRef.value.init();
  }
}

const productId = ref<number>(0);

provide("productId", productId);

onMounted(() => {
  if (productStore.isJumpProduct) {
    nextTick(() => {
      isShowMainTable.value = false;
      isShowInfo.value = true;
      productId.value = productStore.productId;
      if (infoDetailRef.value.activeName) {
        infoDetailRef.value.activeName = "real-time-measure-points";
      }
      productStore.changeJumpProductStatus(false);
    });
  }
});

router.beforeEach((to, from, next) => {
  if (
    to.path === "/product/management" &&
    from.path === "/deviceManagement/deviceInstantiation" &&
    productStore.isJumpProduct
  ) {
    nextTick(() => {
      isShowMainTable.value = false;
      isShowInfo.value = true;
      productId.value = productStore.productId;
      if (infoDetailRef.value.activeName) {
        infoDetailRef.value.activeName = "real-time-measure-points";
      }
    });
    productStore.changeJumpProductStatus(false);
  } else if (to.path === "/product/management") {
    nextTick(() => {
      isShowInfo.value = false;
      mainTableRef.value.currentPage = 1;
      mainTableRef.value.pageSize = 10;
      isShowMainTable.value = true;
    });
  }
  next();
});
</script>
<style lang="scss" scoped></style>
