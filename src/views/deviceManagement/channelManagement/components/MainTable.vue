<template>
  <div class="h-full">
    <div class="w-full mb-6 h-[32px]">
      <el-input
        class="important-w-[280px] float-left"
        size="small"
        placeholder="请输入通道名称"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchChannel"
        clearable
      >
      </el-input>
      <PesudoFormItem class="ml-4 float-left" label="选择厂站">
        <el-select
          v-model="channelSelectValue"
          clearable
          placeholder="请选择所属厂站"
          @change="changeChannelSelect"
        >
          <el-option
            v-for="item in channelOptions"
            :key="item.nodeId"
            :label="item.nodeName"
            :value="item.nodeId"
          ></el-option>
        </el-select>
      </PesudoFormItem>
      <el-button class="float-right" type="primary" @click="handleCreate"
        >+ 创建通道</el-button
      >
      <el-button class="float-right mr-3" @click="exportChannel"
        >导出</el-button
      >
      <el-button class="float-right" @click="importChannel">导入</el-button>
    </div>
    <div class="h-[calc(100%-112px)]">
      <el-table
        ref="channelManagementTable"
        :data="tableData"
        style="width: 100%; height: 100%"
      >
        <template v-for="item in showTableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column class="bg-BG1" label="操作" width="220" align="left">
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
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleInfo(scope.row)"
            >
              查看
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
        popper-class="channelManagement-page"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { Search } from "@element-plus/icons-vue";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { tableColumn } from "./rules";
import { usePagination } from "@/utils/hook/pagination";
import type { DropdownInstance } from "element-plus";
import type { OptionType } from "@/views/systemNetworkNodeManagement/components/rules";
import {
  getAllChannelNodes,
  getChannelNodes,
  delChannels,
} from "@/api/channelManagement/index";
import type { ChannelsResponse } from "@/api/channelManagement/type";

/*
事件定义
*/
const emit = defineEmits(["infoEvent"]);

const props = withDefaults(
  defineProps<{
    stationOptions: OptionType[];
    isShowMainTable: boolean;
  }>(),
  {
    stationOptions: () => [],
    isShowMainTable: false,
  }
);

watch(
  () => props.stationOptions,
  (val) => {
    nextTick(() => {
      channelOptions.value = val;
    });
  },
  { deep: true, immediate: true }
);

const searchValue = ref<string>("");
function searchChannel() {
  currentPage.value = 1;
  if (channelSelectValue.value) {
    channelOptions.value.forEach((item) => {
      if (item.nodeId === channelSelectValue.value) {
        initData({ stationId: item.nodeId, stationName: item.nodeName });
      }
    });
  } else {
    initData();
  }
}
const channelSelectValue = ref<number>();
function changeChannelSelect(value: number) {
  currentPage.value = 1;
  if (value) {
    channelOptions.value.forEach((item) => {
      if (item.nodeId === value) {
        initData({ stationId: item.nodeId, stationName: item.nodeName });
      }
    });
  } else {
    initData();
  }
}
const channelOptions = ref<OptionType[]>([]);

function importChannel() {
  console.log("引入");
}
function exportChannel() {
  console.log("导出");
}

const tableData = ref<object[]>([]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
const channelManagementTable = ref();
const operateElDropdown = ref<DropdownInstance>();
const showTableColumn = ref([{}]);
const checkedColumn = ref<string[]>([]);
function filterCheckedColumnChange() {
  if (!operateElDropdown.value) return;
  showTableColumn.value = tableColumn.value.filter((item) => {
    return checkedColumn.value.includes(item.label as string);
  });
  window.localStorage.setItem(
    "channelManagement-checkedColumn",
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
    "channelManagement-checkedColumn",
    JSON.stringify(checkedColumn.value)
  );
  operateElDropdown.value.handleClose();
}
function visibleChange(value: boolean) {
  if (value) {
    checkedColumn.value = JSON.parse(
      window.localStorage.getItem("channelManagement-checkedColumn") as string
    );
  }
}

function sizeChange(val: number) {
  pageSize.value = val;
  currentPage.value = 1;
  initData();
}

function currentChange(val: number) {
  currentPage.value = val;
  initData();
}

function handleCreate() {
  emit("infoEvent", "create", 0);
}

function handleInfo(node: any) {
  emit("infoEvent", "info", node);
}
function handleEdit(node: any) {
  emit("infoEvent", "edit", node);
}
async function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该通道吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await delChannels([id]);
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

function init(station?: { stationId: number; stationName: string }) {
  if (station) {
    initData(station);
  } else {
    initData();
  }
  showTableColumn.value = cloneDeep(tableColumn.value);
  checkedColumn.value = tableColumn.value.map((item) => {
    return item.label as string;
  });
  let checkedColumnStroage = window.localStorage.getItem(
    "channelManagement-checkedColumn"
  );
  if (!checkedColumnStroage) {
    window.localStorage.setItem(
      "channelManagement-checkedColumn",
      JSON.stringify(checkedColumn.value)
    );
  } else {
    const checkedColumnTable = JSON.parse(checkedColumnStroage);
    showTableColumn.value = tableColumn.value.filter((item) => {
      return checkedColumnTable.includes(item.label);
    });
  }
}

async function initData(station?: { stationId: number; stationName: string }) {
  let data: any[] = [];
  let res: UniversalReponse<ChannelsResponse[]>;
  if (!channelSelectValue.value) {
    res = await getAllChannelNodes({
      page_size: pageSize.value,
      page: currentPage.value,
      node_name: searchValue.value,
      includeInf: false,
    });
  } else {
    res = await getChannelNodes({
      id: channelSelectValue.value,
      page_size: pageSize.value,
      page: currentPage.value,
      node_name: searchValue.value,
      includeInf: false,
      maxDeviceCount: 100,
    });
  }
  if (res.code === 0 && res.data?.length) {
    if (!channelSelectValue.value) {
      res.data.forEach((item: any) => {
        if (station) {
          data.push({
            stationId: station.stationId,
            stationName: station.stationName,
            ...item,
          });
        } else {
          if (item.channels?.length) {
            item.channels.forEach((ele: any) => {
              data.push({
                stationId: item.station.nodeId,
                stationName: item.station.nodeName,
                ...ele,
              });
            });
          }
        }
      });
    } else {
      res.data.forEach((ele: any) => {
        data.push({
          stationId: ele.nodeId,
          stationName: ele.nodeName,
          ...ele,
        });
      });
    }
    data.sort((a, b) => {
      return a.nodeId - b.nodeId;
    });
    totalCount.value = res.total as number;
    tableData.value = data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

onActivated(() => {
  if (props.isShowMainTable) {
    init();
  }
});

defineExpose({
  init,
  channelSelectValue,
  searchValue,
  currentPage,
  pageSize,
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
