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
      <PesudoFormItem class="float-left ml-4" label="测点类型">
        <el-select
          class="important-w-[150px]"
          v-model="measurePointsTypeValue"
          placeholder="请选择所属厂站"
          @change="changeMeasurePointsType"
        >
          <el-option
            v-for="item in measurePointsTypeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </PesudoFormItem>
      <el-button class="float-right" type="primary" @click="createMeaturePoint"
        >+ 新增测点</el-button
      >
      <el-button class="float-right mr-3" @click="snapshotQuickConfiguration"
        >快照配置</el-button
      >
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="measurePointsMainTableRef"
        class="measurePointsMainTable"
        :data="tableData"
        stripe
        style="width: 100%; height: 100%"
      >
        <template v-for="item in tableDataColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column label="操作" width="220" align="left">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.property_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

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
    <CreateMeasurePoints
      v-model="isShowMeasurePoints"
      :infoType="infoType"
      :node="currentNode"
      @infoTOMain="infoTOMain"
    ></CreateMeasurePoints>
    <SnapshotQuickConfiguration
      v-model="isShowSnapshotQuick"
      @ok="refreashMeasure"
    ></SnapshotQuickConfiguration>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import { measurePointsMainTableColumn } from "./rules";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import CreateMeasurePoints from "./CreateMeasurePoints.vue";
import SnapshotQuickConfiguration from "./SnapshotQuickConfiguration.vue";
import {
  getProductProperty,
  deleteProductProperty,
} from "@/api/productManage/index";
import type { ProductPropertyResponse } from "@/api/productManage/types";

const productId: any = inject<number>("productId");

/*
事件定义
*/
const emit = defineEmits(["ok"]);

const searchValue = ref<string>("");
function searchChannel() {
  getMeasurePoints();
}

const measurePointsTypeValue = ref<number>(0);
const measurePointsTypeOption = ref<{ id: number; name: string }[]>([
  { id: 0, name: "全部" },
  { id: 1, name: "模拟量" },
  { id: 2, name: "开关量" },
]);
function changeMeasurePointsType(val: number) {
  getMeasurePoints();
}

function snapshotQuickConfiguration() {
  isShowSnapshotQuick.value = true;
}
function createMeaturePoint() {
  isShowMeasurePoints.value = true;
  infoType.value = "create";
}

const infoType = ref<string>("create");
function infoTOMain() {
  getMeasurePoints();
}

const currentNode = ref<ProductPropertyResponse>();
const tableData = ref<object[]>([]);
const tableDataColumn = ref(measurePointsMainTableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function handleEdit(item: ProductPropertyResponse) {
  currentNode.value = item;
  infoType.value = "edit";
  isShowMeasurePoints.value = true;
}
function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该测点吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteProductProperty(productId.value, [id]);
      if (res.code === 0) {
        ElMessage.success("删除成功！");
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value -= 1;
        }
        getMeasurePoints();
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  getMeasurePoints();
}
function currentChange(val: number) {
  currentPage.value = val;
  getMeasurePoints();
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

const isShowMeasurePoints = ref<boolean>(false);
const isShowSnapshotQuick = ref<boolean>(false);

async function getMeasurePoints() {
  const param = {
    page_size: pageSize.value,
    page: currentPage.value,
    property_type: measurePointsTypeValue.value,
    property_name: searchValue.value,
  };
  const res: UniversalReponse<ProductPropertyResponse[]> =
    await getProductProperty(productId.value, param);
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

function emptyData() {
  currentPage.value = 1;
  pageSize.value = 10;
  tableData.value = [];
  totalCount.value = 0;
}

function initData() {
  emptyData();
  getMeasurePoints();
}

onMounted(() => {
  //   initData();
});

function refreashMeasure() {
  emit("ok");
}

defineExpose({
  initData,
});

provide("isShowSnapshotQuick", isShowSnapshotQuick);
</script>
<style lang="scss" scoped>
.measurePointsMainTable {
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
