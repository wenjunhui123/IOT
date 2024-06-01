<template>
  <div class="important-bg-BG flex w-full h-full box-border">
    <CetAside>
      <template #aside>
        <div class="w-full h-full">
          <el-input
            class="mb-4"
            size="small"
            placeholder="请输入关键字"
            :suffix-icon="Search"
            v-model="baseFilterText"
            clearable
          ></el-input>
          <el-tree
            v-if="isShowTree"
            ref="treeRef"
            class="filter-tree deviceInstantiation-tree h-[calc(100%-50px)] overflow-y-auto"
            :highlight-current="true"
            :props="defaultProps"
            :current-node-key="currentNode.modelLabel_id"
            node-key="modelLabel_id"
            :load="loadNode"
            lazy
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          />
        </div>
      </template>
      <template #container>
        <div class="h-[32px] leading-[32px] mb-6">
          <div
            class="float-left h-[28px] leading-[28px] text-[16px] text-T2 font-medium"
          >
            {{ isShowName ? currentNode.nodeName : "" }}
          </div>
          <div
            v-if="currentNode.modelLabel === 'channel' && isShowName"
            class="float-left ml-2 box-border leading-[18px] bg-[rgba(0,162,255,0.1)] h-[28px] rounded-[3px] px-[8px] py-[5px] text-[12px] text-[#00A2FF]"
          >
            通道ID:{{ currentNode.nodeId }}
          </div>
          <div
            v-if="
              (currentNode.modelLabel === 'station' ||
                currentNode.modelLabel === 'channel') &&
              isShowName
            "
            class="float-left ml-2 box-border leading-[18px] bg-[rgba(0,162,255,0.1)] h-[28px] rounded-[3px] px-[8px] py-[5px] text-[12px] text-[#00A2FF]"
          >
            厂站ID:{{
              currentNode.modelLabel === "channel"
                ? currentNode.parentNodeId
                : currentNode.nodeId
            }}
          </div>
          <div class="float-right flex">
            <el-input
              class="mr-4 important-w-[280px]"
              size="small"
              placeholder="请输入关键字"
              :suffix-icon="Search"
              v-model="keyValue"
              clearable
            ></el-input>
            <el-button @click="exportDevice">导出</el-button>
            <el-button type="primary" @click="addNewDevice"
              >+ 新增设备</el-button
            >
          </div>
        </div>
        <div class="h-[calc(100%-112px)]">
          <el-table
            ref="deviceInstantiationTable"
            class="deviceInstantiation"
            :data="tableData"
            stripe
            style="width: 100%; height: 100%"
          >
            <template v-for="item in tableDataColumn" :key="item.prop">
              <el-table-column v-bind="item" />
            </template>
            <el-table-column label="操作" width="120px" align="left">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="handleCheck(scope.row.device_id)"
                >
                  查看
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  link
                  @click="handleDelete(scope.row.device_id)"
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
            popper-class="deviceInstantiation-page"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </template>
    </CetAside>

    <CreateOrEditDevice
      v-model="isShowCreateOrEditDevice"
      :infoType="deviceInfoType"
      :currentNode="currentNode"
      @ok="createDevice"
    ></CreateOrEditDevice>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import {
  getMainDeviceData,
  deleteDevices,
} from "@/api/deviceInstantiation/index";
import type {
  DevicesUniversalQuery,
  MainDeviceData,
} from "@/api/deviceInstantiation/types";
import { getNetworkNodes } from "@/api/stationnodes/index";
import { getChannelNodes } from "@/api/channelManagement/index";
import CetAside from "@/components/CetAside/index.vue";
import { usePagination } from "@/utils/hook/pagination";
import { mainTableColumn } from "./rules";
import { ElTree } from "element-plus";
import { useSettingsStore } from "@/stores/modules/settings";
import CreateOrEditDevice from "./CreateOrEditDevice.vue";

/*
事件定义
*/
const emit = defineEmits(["infoEvent"]);

const baseFilterText = ref("");
watch(baseFilterText, (val) => {
  treeRef.value!.filter(val);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.nodeName.includes(value);
};

interface Tree {
  [key: string]: any;
}
interface DataTree {
  modelLabel_id: string;
  nodeId: number;
  nodeName: string;
  isLeaf: boolean;
  modelLabel: string;
  parentNodeId?: number;
  children?: DataTree[];
}

const isShowTree = ref<boolean>(true);
const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "nodeName",
  value: "modelLabel_id",
  isLeaf: "isLeaf",
};
const currentNode = ref<any>({
  modelLabel_id: "station_0",
  nodeId: 0,
  nodeName: "全部厂站",
  modelLabel: "all",
  isLeaf: false,
  children: [],
});
function nodeClick(item: any) {
  currentNode.value = item;
  currentPage.value = 1;
  pageSize.value = 10;
  totalCount.value = 0;
  tableData.value = [];
  if (item.modelLabel === "all") {
    initData();
  } else if (item.modelLabel === "station") {
    initData("station", item.nodeId);
  } else if (item.modelLabel === "channel") {
    initData("channel", item.nodeId);
  } else {
    initData();
  }
}
const loadNode = async (node: Node, resolve: (data: DataTree[]) => void) => {
  pageSize.value = 10;
  currentPage.value = 1;
  if (node.level === 0) {
    return resolve([
      {
        modelLabel_id: "all_0",
        nodeId: 0,
        nodeName: "全部厂站",
        modelLabel: "all",
        isLeaf: false,
        children: [],
      },
    ]);
  } else if (node.level === 1) {
    const treeData = await getStationOption(node.data);
    resolve(treeData);
  } else if (node.level === 2) {
    const treeData = await getChannelOption(node.data);
    resolve(treeData);
  }
};

async function refreshMainTable() {
  currentNode.value = {
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    children: [],
  };
  const treeData = await getStationOption({
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    children: [],
  });
  treeData.forEach((item) => {
    treeRef.value!.remove(item);
  });
  isShowTree.value = false;
  nextTick(() => {
    isShowTree.value = true;
    treeRef.value!.updateKeyChildren(
      "all_0",
      treeData.map((item) => ({
        ...item,
      }))
    );
  });
}

async function getStationOption(node: any) {
  const res = await getNetworkNodes();
  if (res.code === 0 && res.data.length) {
    return res.data.map((item) => {
      const data = {
        modelLabel_id: `station_${item.nodeId}`,
        modelLabel: "station",
        nodeId: item.nodeId,
        nodeName: item.nodeName,
        isLeaf: false,
        children: [],
      };
      node.children.push(data);
      return data;
    });
  } else {
    return [];
  }
}
async function getChannelOption(node: any) {
  const res = await getChannelNodes({
    id: node.nodeId,
    page_size: 1000,
    page: 1,
    node_name: "",
    includeInf: false,
    maxDeviceCount: 0,
  });
  if (res.code === 0 && res.data?.length) {
    return res.data.map((item: any) => {
      const data = {
        modelLabel_id: `channel_${item.nodeId}`,
        modelLabel: "channel",
        nodeId: item.nodeId,
        nodeName: item.nodeName,
        isLeaf: true,
        parentNodeId: item.parentNodeId,
        children: [],
      };
      node.children.push(data);
      return data;
    });
  } else {
    return [];
  }
}

const keyValue = ref<string>("");
function exportDevice() {}
function addNewDevice() {
  isShowCreateOrEditDevice.value = true;
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

const isShowName = ref<boolean>(false);
const tableData = ref<MainDeviceData[]>([]);
const tableDataColumn = ref(mainTableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
async function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  totalCount.value = 0;
  tableData.value = [];
  if (currentNode.value.modelLabel === "all") {
    await initData();
  } else if (currentNode.value.modelLabel === "station") {
    await initData("station", currentNode.value.nodeId);
  } else if (currentNode.value.modelLabel === "channel") {
    await initData("channel", currentNode.value.nodeId);
  } else {
    await initData();
  }
}
async function currentChange(val: number) {
  currentPage.value = val;
  tableData.value = [];
  if (currentNode.value.modelLabel === "all") {
    await initData();
  } else if (currentNode.value.modelLabel === "station") {
    await initData("station", currentNode.value.nodeId);
  } else if (currentNode.value.modelLabel === "channel") {
    await initData("channel", currentNode.value.nodeId);
  } else {
    await initData();
  }
}
function handleCheck(id: number) {
  emit("infoEvent", "info", id);
}

function createDevice() {
  if ((totalCount.value / pageSize.value) % 1 !== 0) {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value);
  } else {
    currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
  }
  if (currentNode.value.modelLabel === "all") {
    initData();
  } else if (currentNode.value.modelLabel === "station") {
    initData("station", currentNode.value.nodeId);
  } else if (currentNode.value.modelLabel === "channel") {
    initData("channel", currentNode.value.nodeId);
  } else {
    initData();
  }
}

function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该设备吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteDevices([id]);
      if (res.code === 0) {
        ElMessage.success("删除成功！");
        if (tableData.value.length === 1 && currentPage.value > 1) {
          currentPage.value -= 1;
        }
        if (currentNode.value.modelLabel === "all") {
          initData();
        } else if (currentNode.value.modelLabel === "station") {
          initData("station", currentNode.value.nodeId);
        } else if (currentNode.value.modelLabel === "channel") {
          initData("channel", currentNode.value.nodeId);
        } else {
          initData();
        }
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

const isShowCreateOrEditDevice = ref<boolean>(false);

const deviceInfoType = ref<string>("create");

async function initData(type: string = "", id: number = 0) {
  emptyData();
  const param: DevicesUniversalQuery = {
    page_size: pageSize.value,
    page: currentPage.value,
    device_name: keyValue.value ? keyValue.value : undefined,
    chn_id: type === "channel" ? id : undefined,
    sta_id: type === "station" ? id : undefined,
  };
  const res: UniversalReponse<MainDeviceData[]> =
    await getMainDeviceData(param);
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }

  isShowName.value = true;
}

function emptyData() {
  isShowName.value = false;
}

onActivated(() => {
  currentNode.value = {
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    children: [],
  };
  initData();
  nextTick(() => {
    isShowTree.value = false;
    nextTick(() => {
      isShowTree.value = true;
      treeRef.value!.setCurrentNode(currentNode.value, false);
    });
    // refreshMainTable();
  });
});

defineExpose({
  initData,
  refreshMainTable,
  currentNode,
  currentPage,
  pageSize,
});
</script>

<style lang="scss" scoped>
.deviceInstantiation {
  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}
.deviceInstantiation-tree {
  :deep(.el-tree-node__content > .el-tree-node__expand-icon) {
    padding: 2px;
  }
  :deep(.is-focusable:focus > .el-tree-node__content) {
    @include background_color(BG1);
  }
  :deep(.is-current:focus > .el-tree-node__content) {
    @include background_color(BG4, !important);
  }
  :deep(.el-tree-node__content) {
    &:hover {
      @include background_color(BG4);
    }
  }
}
</style>
