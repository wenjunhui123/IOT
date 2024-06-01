<template>
  <div class="h-full">
    <div class="w-full mb-4 h-[32px]">
      <el-input
        class="important-w-[280px] float-left"
        size="small"
        placeholder="请输入关键字"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchChannel"
        clearable
      >
      </el-input>
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="deviceTimingRecordTableRef"
        class="deviceTimingRecordTable"
        :data="tableData"
        stripe
        style="width: 100%; height: 100%"
      >
        <template v-for="item in tableDataColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>

        <template #empty class="empty">
          <el-empty
            :image="theme === 'light' ? emptyImgUrl[0] : emptyImgUrl[1]"
            :image-size="150"
          ></el-empty>
        </template>
      </el-table>
      <el-pagination
        class="pt-6 fr"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="totalCount"
        popper-class="productManagement-page"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import { tableColumn } from "./rules";
import { getProductRecord } from "@/api/productManage/index";
import type { ProductRecordResponse } from "@/api/productManage/types";

const productId: any = inject<number>("productId");

watch(
  () => productId,
  (val: Ref) => {
    if (val.value) {
      nextTick(() => {
        queryProductRecord();
      });
    }
  },
  { immediate: true, deep: true }
);

const searchValue = ref<string>("");
function searchChannel() {}

const tableData = ref<object[]>([]);
const tableDataColumn = ref(tableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  queryProductRecord();
}
function currentChange(val: number) {
  currentPage.value = val;
  queryProductRecord();
}

const settingsStore = useSettingsStore();
let theme = ref<string>(settingsStore.theme);
settingsStore.$subscribe((mutation, state) => {
  theme.value = state.theme;
});
const emptyImgUrl = ref([
  new URL("../../assets/emptyData-light.svg", import.meta.url).href,
  new URL("../../assets/emptyData-dark.svg", import.meta.url).href,
]);

async function queryProductRecord() {
  const param = {
    page_size: pageSize.value,
    page: currentPage.value,
  };
  const res: UniversalReponse<ProductRecordResponse[]> = await getProductRecord(
    productId.value,
    param
  );
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}
</script>
<style lang="scss" scoped>
.deviceTimingRecordTable {
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
