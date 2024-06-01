<template>
  <div class="p-6">
    <div class="w-full mb-6 h-[32px] flex justify-between">
      <el-input
        class="important-w-[280px]"
        size="small"
        placeholder="请输入厂站名称"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchStation"
        clearable
      >
      </el-input>
      <el-button type="primary" @click="handleCreate">新建厂站</el-button>
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="factoryAndStationManagementTable"
        :data="tableData"
        style="width: 100%; height: 100%"
      >
        <template v-for="item in tableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column label="操作" width="220" align="left">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEdit(scope.row.nodeId, scope.row.nodeName)"
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
      :currentNode="currentNode"
      :isEdit="isEditType"
      @ok="handleCreateOrEdit"
    >
    </CreateOrEdit>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { tableColumn } from "./components/rules";
import { usePagination } from "@/utils/hook/pagination";
import CreateOrEdit from "./components/CreateOrEdit.vue";
import { getNetworkNodes, deleteStation } from "@/api/stationnodes/index";
import { onActivated } from "vue";

defineOptions({
  name: "FactoryAndStationManagement",
  inheritAttrs: false,
});

const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

const isEditType = ref<boolean>(false);

const searchValue = ref<string>("");
function searchStation() {
  initData();
}

const isShowCreatOrEdit = ref<boolean>(false);
function handleCreate() {
  isShowCreatOrEdit.value = true;
  isEditType.value = false;
}

const factoryAndStationManagementTable = ref();
const tableData = ref<object[]>([]);

const currentNode = reactive<{ nodeId: number; nodeName: string }>({
  nodeId: 0,
  nodeName: "",
});
function handleEdit(nodeId: number, nodeName: string) {
  isShowCreatOrEdit.value = true;
  isEditType.value = true;
  currentNode.nodeId = nodeId;
  currentNode.nodeName = nodeName;
}
async function handleDelete(nodeId: number) {
  ElMessageBox.confirm("确定要删除该厂站吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteStation(nodeId);
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

function sizeChange(val: number) {
  pageSize.value = val;
  initData();
}

function currentChange(val: number) {
  currentPage.value = val;
  initData();
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
  const res = await getNetworkNodes({
    page_size: pageSize.value,
    page: currentPage.value,
    node_name: searchValue.value,
  });
  if (res.code === 0 && res.data?.length) {
    tableData.value = res.data;
    totalCount.value = res.total ? res.total : 0;
  } else {
    tableData.value = [];
    totalCount.value = 0;
  }
}
onActivated(() => {
  currentPage.value = 1;
  pageSize.value = 10;
  initData();
});
</script>
