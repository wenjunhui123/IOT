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
      <PesudoFormItem class="float-left ml-4" label="动作类型">
        <el-select
          class="important-w-[150px]"
          v-model="remoteControlTypeValue"
          placeholder="请选择动作类型"
          @change="changeRemoteControlType"
        >
          <el-option
            v-for="item in remoteControlTypeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </PesudoFormItem>
      <el-button class="float-right" type="primary" @click="createRemoteControl"
        >+ 新增遥控点</el-button
      >
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="remoteControlTableRef"
        class="remoteControlTable"
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
              @click="handleCheck(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.service_id)"
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
    <CreateOrEditeRemote
      :infoType="infoType"
      :node="currentNode"
      @infoTOMain="infoTOMain"
      v-model="isShowRemoteControl"
    ></CreateOrEditeRemote>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { tableColumn } from "./rules";
import CreateOrEditeRemote from "./CreateOrEditeRemote.vue";
import {
  getProductRemoteService,
  deleteProductRemoteService,
} from "@/api/productManage/index";
import type { ProductRemoteResponse } from "@/api/productManage/types";

const productId: any = inject<number>("productId");

watch(
  () => productId,
  (val: Ref) => {
    if (val.value) {
      nextTick(() => {
        getProductRemote();
      });
    }
  },
  { immediate: true, deep: true }
);

const searchValue = ref<string>("");
function searchChannel() {
  getProductRemote();
}

const remoteControlTypeValue = ref<number>(0);
const remoteControlTypeOption = ref<{ id: number; name: string }[]>([
  { id: 0, name: "全部" },
  { id: 1, name: "闭合" },
  { id: 2, name: "打开" },
]);
function changeRemoteControlType(val: number) {
  currentPage.value = 1;
  getProductRemote();
}

const isShowRemoteControl = ref<boolean>(false);
function createRemoteControl() {
  isShowRemoteControl.value = true;
  infoType.value = "create";
}

const infoType = ref<string>("create");
function infoTOMain(type: "create" | "edit") {
  if ((totalCount.value / pageSize.value) % 1 !== 0 && type === "create") {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value);
  } else if (type === "create") {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
  }
  getProductRemote();
}

const currentNode = ref<ProductRemoteResponse>();
const tableData = ref<object[]>([]);
const tableDataColumn = ref(tableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function handleCheck(item: ProductRemoteResponse) {
  currentNode.value = item;
  infoType.value = "edit";
  isShowRemoteControl.value = true;
}
function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该遥控吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteProductRemoteService(productId.value, [id]);
      if (res.code === 0) {
        ElMessage.success("删除成功！");
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value -= 1;
        }
        getProductRemote();
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  getProductRemote();
}
function currentChange(val: number) {
  currentPage.value = val;
  getProductRemote();
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

async function getProductRemote() {
  const param = {
    page_size: pageSize.value,
    page: currentPage.value,
    action_type: remoteControlTypeValue.value,
    service_name: searchValue.value,
  };
  const res: UniversalReponse<ProductRemoteResponse[]> =
    await getProductRemoteService(productId.value, param);
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
.remoteControlTable {
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
