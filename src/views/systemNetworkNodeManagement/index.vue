<template>
  <div class="p-6">
    <div class="w-full mb-6 h-[32px] flex justify-between">
      <el-input
        class="important-w-[280px]"
        size="small"
        placeholder="请输入节点名称"
        :suffix-icon="Search"
        v-model="searchValue"
        clearable
        @blur="changeSearchValue"
      >
      </el-input>
      <el-button type="primary" @click="handleCreate">新建网络节点</el-button>
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="systemNetworkNodeManagementTable"
        :data="tableData"
        style="width: 100%; height: 100%"
      >
        <template v-for="item in showTableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column label="操作" width="150" align="left">
          <template #header>
            <el-dropdown
              trigger="click"
              ref="operateElDropdown"
              @visible-change="visibleChange"
            >
              <div class="operate el-dropdown-link leading-[24px]">
                <span>操作</span>
                <i class="el-icon-s-tools pl-2"></i>
              </div>
              <template #dropdown>
                <div class="table-operate-dropdown-node">
                  <el-checkbox-group v-model="checkedColumn" :min="1">
                    <el-checkbox
                      v-for="check in tableColumn"
                      :key="check.prop"
                      :label="check.label"
                      >{{ check.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <div class="flex flex-justify-end">
                    <span
                      class="cursor-pointer"
                      @click="filterCheckedColumnChange"
                      >筛选</span
                    >
                    <span
                      class="cursor-pointer ml-3"
                      @click="resetCheckedColumnChange"
                      >重置</span
                    >
                  </div>
                </div>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(scope.row.nodeId)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.nodeId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pt-6 fr"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="totalCount"
        popper-class="systemNetworkNodeManagement-page"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <CreateOrEdit
      v-model="isShowCreatOrEdit"
      :nodeId="currentId"
      :isEdit="isEditType"
      @ok="handleCreateOrEdit"
    >
    </CreateOrEdit>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { Search } from "@element-plus/icons-vue";
import { tableColumn } from "./components/rules";
import { usePagination } from "@/utils/hook/pagination";
import type { DropdownInstance } from "element-plus";
import CreateOrEdit from "./components/CreateOrEdit.vue";
import { getNetworkNodes, delNetWork } from "@/api/systemNetwork/index";
import type { Data } from "@/api/systemNetwork/types";

defineOptions({
  name: "SystemNetworkNodeManagement",
  inheritAttrs: false,
});

const isEditType = ref<boolean>(false);

const searchValue = ref<string>("");
function changeSearchValue() {
  initData();
}

const currentId = ref<number>(0);
const tableData = ref<Data[]>([]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
const operateElDropdown = ref<DropdownInstance>();
const showTableColumn = ref([{}]);
const checkedColumn = ref<string[]>([]);
function filterCheckedColumnChange() {
  if (!operateElDropdown.value) return;
  showTableColumn.value = tableColumn.value.filter((item) => {
    return checkedColumn.value.includes(item.label as string);
  });
  window.localStorage.setItem(
    "systemNetworkNodeManagement-checkedColumn",
    JSON.stringify(checkedColumn.value)
  );
  operateElDropdown.value.handleClose();
}
function resetCheckedColumnChange() {
  if (!operateElDropdown.value) return;
  checkedColumn.value = tableColumn.value.map((item) => {
    return item.label as string;
  });
  showTableColumn.value = tableColumn.value.filter((item) => {
    return checkedColumn.value.includes(item.label as string);
  });
  window.localStorage.setItem(
    "systemNetworkNodeManagement-checkedColumn",
    JSON.stringify(checkedColumn.value)
  );
  operateElDropdown.value.handleClose();
}
function visibleChange(value: boolean) {
  if (value) {
    checkedColumn.value = JSON.parse(
      window.localStorage.getItem(
        "systemNetworkNodeManagement-checkedColumn"
      ) as string
    );
  }
}

function sizeChange(val: number) {
  pageSize.value = val;
  initData();
}

function currentChange(val: number) {
  currentPage.value = val;
  initData();
}

const systemNetworkNodeManagementTable = ref();

const isShowCreatOrEdit = ref<boolean>(false);
function handleCreate() {
  isShowCreatOrEdit.value = true;
  isEditType.value = false;
}

function handleEdit(id: number) {
  isShowCreatOrEdit.value = true;
  isEditType.value = true;
  currentId.value = id;
}
async function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该节点吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await delNetWork([id]);
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

function init() {
  currentPage.value = 1;
  pageSize.value = 10;
  initData();
  showTableColumn.value = cloneDeep(tableColumn.value);
  checkedColumn.value = tableColumn.value.map((item) => {
    return item.label as string;
  });
  let checkedColumnStroage = window.localStorage.getItem(
    "systemNetworkNodeManagement-checkedColumn"
  );
  if (!checkedColumnStroage) {
    window.localStorage.setItem(
      "systemNetworkNodeManagement-checkedColumn",
      JSON.stringify(checkedColumn.value)
    );
  } else {
    const checkedColumnTable = JSON.parse(checkedColumnStroage);
    showTableColumn.value = tableColumn.value.filter((item) => {
      return checkedColumnTable.includes(item.label);
    });
  }
}

/* 新增和编辑弹窗组件显隐 */
function handleCreateOrEdit() {
  if ((totalCount.value / pageSize.value) % 1 !== 0 && !isEditType.value) {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value);
  } else if (!isEditType.value) {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
  }
  initData();
}

async function initData() {
  let tableDatas = [];
  const res = await getNetworkNodes({
    page_size: pageSize.value,
    page: currentPage.value,
    node_name: searchValue.value,
  });
  if (res.code === 0 && res.data.length > 0) {
    tableDatas = res.data;
    totalCount.value = res.total;
    tableData.value = tableDatas;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

onActivated(() => {
  init();
});
</script>

<style lang="scss" scoped>
.operate {
  cursor: pointer;

  :deep(.el-checkbox) {
    display: block !important;
  }
}
</style>
