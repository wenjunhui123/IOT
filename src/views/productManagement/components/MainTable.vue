<template>
  <div class="h-full p-6">
    <div class="w-full mb-6 h-[32px] flex justify-between">
      <el-input
        class="important-w-[280px]"
        size="small"
        placeholder="请输入关键字"
        :suffix-icon="Search"
        v-model="searchValue"
        clearable
        @blur="changeSearchValue"
      >
      </el-input>
      <div class="flex">
        <el-button @click="exportProducts">导出</el-button>
        <el-button type="primary" @click="customProducts"
          >+ 自定义产品</el-button
        >
        <el-button type="primary" @click="importProducts">+ 导入产品</el-button>
      </div>
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="productManagementTable"
        class="productManangement"
        :data="tableData"
        stripe
        style="width: 100%; height: 100%"
      >
        <template v-for="item in mainTableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column label="操作" width="220" align="left">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleCheck(scope.row.product_id, scope.row.product_name)"
            >
              查看
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.product_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

        <template #empty class="empty">
          <el-empty
            :image="theme === 'light' ? emptyImgUrl[0] : emptyImgUrl[1]"
            :image-size="320"
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
    <CreateOrEditCustomProducts
      v-model="isShowCustomProducts"
      :infoType="customProductsInfoType"
      :node="currentCustomProductsNode"
      @ok="handleCreateOrEdit"
    ></CreateOrEditCustomProducts>
    <CreateOrEditImportProducts
      v-model="isShowImportProducts"
      :infoType="customProductsInfoType"
      @ok="handleCreateOrEdit"
    ></CreateOrEditImportProducts>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { usePagination } from "@/utils/hook/pagination";
import { mainTableColumn } from "./rules";
import { useSettingsStore } from "@/stores/modules/settings";
import { getMainProductDatas, deleteProducts } from "@/api/productManage/index";
import type { MainProductData } from "@/api/productManage/types";
import CreateOrEditCustomProducts from "./CreateOrEditCustomProducts.vue";
import CreateOrEditImportProducts from "./CreateOrEditImportProducts.vue";
defineOptions({
  name: "MainTable",
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    isShowMainTable: boolean;
  }>(),
  {
    isShowMainTable: true,
  }
);

/*
事件定义
*/
const emit = defineEmits(["infoEvent"]);

const searchValue = ref<string>("");
function changeSearchValue() {}

const isShowCustomProducts = ref<boolean>(false);

const customProductsInfoType = ref<string>("create");
const currentCustomProductsNode = ref<MainProductData>({
  product_id: 0,
  product_name: "",
  product_src: 0,
  create_time: 0,
  description: "",
  product_type: 0,
});
function exportProducts() {}
function customProducts() {
  isShowCustomProducts.value = true;
}
const isShowImportProducts = ref<boolean>(false);
function importProducts() {
  isShowImportProducts.value = true;
}

const settingsStore = useSettingsStore();
let theme = ref<string>(settingsStore.theme);
settingsStore.$subscribe((mutation, state) => {
  theme.value = state.theme;
});
const emptyImgUrl = ref([
  new URL("../assets/emptyData-light.svg", import.meta.url).href,
  new URL("../assets/emptyData-dark.svg", import.meta.url).href,
]);

const tableData = ref<MainProductData[]>([]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  initData();
}

function handleCheck(id: number, name: string) {
  emit("infoEvent", "info", id);
}
function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该产品吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteProducts([id]);
      if (res.code === 0) {
        ElMessage.success("删除成功！");
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value -= 1;
        }
        initData();
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

function currentChange(val: number) {
  currentPage.value = val;
  initData();
}

async function initData() {
  let res: UniversalReponse<MainProductData[]>;
  res = await getMainProductDatas({
    page_size: pageSize.value,
    page: currentPage.value,
    key_name: searchValue.value,
  });
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

function handleCreateOrEdit() {
  if (
    (totalCount.value / pageSize.value) % 1 !== 0 &&
    customProductsInfoType.value === "create"
  ) {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value);
  } else if (customProductsInfoType.value === "create") {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
  }
  initData();
}

function init() {
  initData();
}

onActivated(() => {
  if (props.isShowMainTable) {
    init();
  }
});

defineExpose({
  currentPage,
  pageSize,
  init,
});
</script>
<style lang="scss" scoped>
.productManangement {
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
