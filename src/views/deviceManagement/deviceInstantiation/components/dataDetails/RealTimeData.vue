<template>
  <div class="h-full">
    <div class="w-full mt-2 mb-4 flex">
      <el-input
        class="important-w-[280px] mr-4"
        size="small"
        placeholder="请输入关键字"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchChannel"
        clearable
      >
      </el-input>
      <PesudoFormItem class="mr-4" label="测点类型">
        <el-select
          class="important-w-[150px]"
          v-model="measurePointTypeValue"
          placeholder="请选择测点类型"
          @change="changeMeasurePointType"
        >
          <el-option
            v-for="item in measurePointTypeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </PesudoFormItem>
    </div>
    <div class="h-[calc(100%-58px)]">
      <el-table
        class="realTimeDataTable"
        :data="tableData"
        style="width: 100%; height: 100%"
      >
        <template v-for="item in realTimeDataTableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column label="操作" width="104" align="left">
          <template #default="scope"
            ><el-button
              type="primary"
              size="small"
              link
              @click="openTrendCurve()"
            >
              趋势曲线
            </el-button>
          </template>
        </el-table-column>
        <template #empty class="empty">
          <el-empty
            :image="theme === 'light' ? emptyImgUrl[0] : emptyImgUrl[1]"
            :image-size="180"
          ></el-empty>
        </template>
      </el-table>
      <el-pagination
        class="pt-5 fr"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <TrendCurve v-model="isShowTrendCurve"></TrendCurve>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import { realTimeDataTableColumn } from "./rules";
import TrendCurve from "./TrendCurve.vue";

const searchValue = ref<string>("");
function searchChannel() {}

const measurePointTypeValue = ref<number>(0);
const measurePointTypeOption = ref<{ id: number; name: string }[]>([
  { id: 0, name: "全部" },
  { id: 1, name: "模拟量" },
  { id: 2, name: "开关量" },
]);
function changeMeasurePointType(val: number) {}

const tableData = ref<object[]>([{}]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
}
function currentChange(val: number) {
  currentPage.value = val;
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

function openTrendCurve() {
  isShowTrendCurve.value = true;
}

const isShowTrendCurve = ref<boolean>(false);
</script>
<style scoped lang="scss">
.realTimeDataTable {
  height: calc(100% - 58px) !important;
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
