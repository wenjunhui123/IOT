<template>
  <div class="important-bg-BG flex w-full h-full box-border">
    <CetAside v-show="!isShowDetail && !isShowEditForward">
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
            class="filter-tree gatewayManagement-tree h-[calc(100%-50px)] overflow-y-auto"
            :highlight-current="true"
            :props="defaultProps"
            :current-node-key="currentNode.modelLabel_id"
            node-key="modelLabel_id"
            :load="loadNode"
            lazy
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          >
            <template #default="scope">
              <div
                v-if="scope.data.modelLabel === 'acquisition_device'"
                class="custom-node"
              >
                <span
                  v-if="scope.data.communication_mode === '串口'"
                  class="inline-block h-[22px] px-2 py-[2px] bg-[rgba(231,127,188,0.1)] rounded-[3px] text-[12px] text-[#E77FBC] mr-2"
                  >{{ scope.data.communication_mode }}</span
                >
                <span
                  v-if="scope.data.communication_mode === '以太网'"
                  class="inline-block h-[22px] px-2 py-[2px] bg-[rgba(0,162,255,0.1)] rounded-[3px] text-[12px] text-[#00A2FF] mr-2"
                  >{{ scope.data.communication_mode }}</span
                >
                <span class="text-[14px] text-[#333333]">{{
                  scope.data.nodeName
                }}</span>
              </div>
              <div v-else class="custom-node">
                <span class="text-[14px] text-[#333333]">{{
                  scope.data.nodeName
                }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </template>
      <template #container>
        <div
          v-if="
            currentNode.modelLabel === 'all' ||
            currentNode.modelLabel === 'gateway'
          "
          class="h-[32px] leading-[32px] mb-6"
        >
          <div class="flex justify-between">
            <div>
              <el-input
                v-if="currentNode.modelLabel === 'all'"
                class="important-w-[280px] float-left"
                size="small"
                placeholder="请输入关键字"
                :suffix-icon="Search"
                v-model="searchValue"
                @blur="searchChannel"
                @clear="searchChannel"
                clearable
              >
              </el-input>
              <PesudoFormItem
                v-if="currentNode.modelLabel === 'all'"
                class="ml-4"
                label="网关类型"
              >
                <el-select
                  class="important-w-[180px]"
                  v-model="gatewayTypeValue"
                  placeholder="请选择网关类型"
                  @change="changeGatewayType"
                >
                  <el-option
                    v-for="item in gatewayTypeOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </PesudoFormItem>
              <PesudoFormItem
                v-if="currentNode.modelLabel === 'all'"
                class="ml-4"
                label="厂站"
              >
                <el-select
                  class="important-w-[150px]"
                  v-model="stationValue"
                  placeholder="请选择所属厂站"
                  @change="changeStation"
                >
                  <el-option
                    v-for="item in stationOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </PesudoFormItem>
              <PesudoFormItem
                v-if="currentNode.modelLabel === 'all'"
                class="ml-4"
                label="IP"
              >
                <el-input
                  class="important-w-[150px] float-left"
                  size="small"
                  placeholder="请输入关键字"
                  :suffix-icon="Search"
                  v-model="ipValue"
                  @blur="ipChannel"
                  @clear="ipChannel"
                  clearable
                >
                </el-input>
              </PesudoFormItem>
            </div>
            <div class="flex">
              <el-button @click="importGateway">导入</el-button>
              <el-button @click="exportGateway">导出</el-button>
              <el-button type="primary" @click="addNewGateway"
                >+ 新增</el-button
              >
            </div>
          </div>
        </div>
        <div :style="tableStyle">
          <el-table
            v-if="isShowTable"
            ref="gatewayManagementTable"
            class="gatewayManagement"
            :data="tableData"
            stripe
            style="width: 100%; height: 100%"
          >
            <template v-for="item in tableColumn" :key="item.prop">
              <el-table-column v-bind="item" />
            </template>
            <el-table-column
              v-if="
                currentNode.modelLabel === 'forward' ||
                currentNode.modelLabel === 'acquisition'
              "
              align="left"
              label="启用"
            >
              <template #default="scope">
                <div style="display: flex; justify-content: left">
                  <el-switch
                    v-model="scope.row.enabled"
                    :before-change="beforeChange"
                    @change="
                      changeEnabled(
                        currentNode.modelLabel,
                        currentNode.nodeId,
                        scope.row
                      )
                    "
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="
                currentNode.modelLabel === 'all' ||
                currentNode.modelLabel === 'gateway'
              "
              label="操作"
              width="170px"
              align="left"
            >
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
                  @click="
                    handleAsyncGateway(
                      scope.row.gateway_id,
                      scope.row.gateway_name
                    )
                  "
                >
                  同步
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  link
                  @click="handleGatewayDelete(scope.row.gateway_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="currentNode.modelLabel === 'acquisition'"
              label="操作"
              width="150px"
              align="left"
            >
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
                  @click="handleEditAdvance(scope.row)"
                >
                  高级参数
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="currentNode.modelLabel === 'forward'"
              label="操作"
              width="120px"
              align="left"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="handleDetail(scope.row)"
                >
                  查看
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
            v-if="
              currentNode.modelLabel === 'all' ||
              currentNode.modelLabel === 'acquisition_device' ||
              currentNode.modelLabel === 'forward_device'
            "
            class="fr"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :layout="layout"
            :total="totalCount"
            popper-class="gatewayManagement-page"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </template>
    </CetAside>
    <EditAcquisitionChannel
      v-model="isShowEditAcquisition"
      :currentNode="currentRow"
      @success="refreshAcquisition"
    ></EditAcquisitionChannel>
    <EditAdvance
      v-model="isShowEditAcAdvance"
      :current-node="currentRow"
    ></EditAdvance>
    <ChannelDetail
      v-show="isShowDetail"
      v-model="isShowDetail"
      :currentNode="currentRow"
      @infoEvent="forwardInfoEvent"
      @editEvent="editEvent"
      @success="refreshForward"
    ></ChannelDetail>
    <EditForwardChannel
      v-show="isShowEditForward"
      v-model="isShowEditForward"
      :currentNode="currentRow"
      :currentForwardInfo="currentForwardInfo"
      @success="refreshForward"
      @detailEvent="detailEvent"
    ></EditForwardChannel>
    <CreatOrEditGateway
      v-model="isShowEditGateway"
      :infoType="gatewayInfoType"
      :currentNode="currentRow"
      @success="refreshMainTable"
    ></CreatOrEditGateway>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import CetAside from "@/components/CetAside/index.vue";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { usePagination } from "@/utils/hook/pagination";
import {
  mainTableColumn,
  acquisitionTableColumn,
  forwardTableColumn,
  deviceForwardTableColumn,
  deviceAcquisitionSerialColumn,
  deviceAcquisitionEthernetColumn,
} from "./rules";
import { useSettingsStore } from "@/stores/modules/settings";
import { ElTree } from "element-plus";
import { ref } from "vue";
import { getAllDevicetypes } from "@/api/channelManagement/index";
import type { Drvtypes } from "@/api/channelManagement/type";
import { getNetworkNodes } from "@/api/stationnodes/index";
import type {
  GatewayMainResponse,
  GatewayAcquisitionResponse,
  GatewayForwardResponse,
  channelDeviceResponse,
  EnableAcquisitionsOrForwards,
  GatewayModelResponse,
} from "@/api/gatewayManage/types";
import {
  getGatewayMainData,
  getSingleGateway,
  getGatewayAcquisitionData,
  getGatewayForwardData,
  getGatewayChannelDeviceData,
  syncGateway,
  deleteGateway,
  enableAcquisitions,
  enableForwards,
  getGatewayModelList,
} from "@/api/gatewayManage/index";
import _ from "lodash";
// 测试弹窗
import EditAcquisitionChannel from "./acquisitionChannel/EditBasic.vue";
import ChannelDetail from "./forwardChannel/ChannelDetail.vue";
import EditForwardChannel from "./forwardChannel/EditInfo.vue";
import EditAdvance from "./acquisitionChannel/EditAdvance.vue";
import CreatOrEditGateway from "./CreateGateway.vue";

defineOptions({
  name: "MainTable",
  inheritAttrs: false,
});

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
  communication_mode?: number;
  parentNodeId?: number;
  children?: DataTree[];
}

const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "nodeName",
  value: "modelLabel_id",
  isLeaf: "isLeaf",
};

const gatewayInfoType = ref<string>("");
const isShowEditGateway = ref<boolean>(false);
const isShowEditAcAdvance = ref<boolean>(false);
const isShowDetail = ref<boolean>(false);
const isShowEditAcquisition = ref<boolean>(false);
const isShowEditForward = ref<boolean>(false);
const currentNode = ref<any>({
  modelLabel_id: "all_0",
  nodeId: 0,
  nodeName: "网关列表",
  modelLabel: "all",
  isLeaf: false,
  children: [],
});

const loadNode = async (node: Node, resolve: (data: DataTree[]) => void) => {
  if (node.level === 0) {
    return resolve([
      {
        modelLabel_id: "all_0",
        nodeId: 0,
        nodeName: "网关列表",
        modelLabel: "all",
        isLeaf: false,
        children: [],
      },
    ]);
  } else if (node.level === 1) {
    const treeData = await queryGatewayMainData(node.data);
    resolve(treeData);
  } else if (node.level === 2) {
    const treeData = [
      {
        modelLabel_id: `acquisition_${node.data.nodeId}`,
        modelLabel: "acquisition",
        nodeId: node.data.nodeId,
        nodeName: "采集通道",
        isLeaf: false,
        children: [],
      },
      {
        modelLabel_id: `forward_${node.data.nodeId}`,
        modelLabel: "forward",
        nodeId: node.data.nodeId,
        nodeName: "转发通道",
        isLeaf: false,
        children: [],
      },
    ];
    node.data.children.push(treeData[0]);
    node.data.children.push(treeData[1]);
    resolve(treeData);
  } else if (node.level === 3) {
    const treeData = await queryChannelData(node.data);
    resolve(treeData);
  }
};

let currentRow = reactive<any>(null);
let currentForwardInfo = reactive<any>(null);

async function queryGatewayMainData(node: any) {
  const res: UniversalReponse<GatewayMainResponse[]> = await getGatewayMainData(
    {
      page_size: 1000,
      page: 1,
    }
  );
  if (res.code === 0 && res.data.length) {
    return res.data.map((item) => {
      const data = {
        modelLabel_id: `gateway_${item.gateway_id}`,
        modelLabel: "gateway",
        nodeId: item.gateway_id,
        nodeName: item.gateway_name,
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
async function queryChannelData(node: any) {
  if (node.modelLabel === "acquisition") {
    const res: UniversalReponse<GatewayAcquisitionResponse[]> =
      await getGatewayAcquisitionData(node.nodeId);
    return formatterChannelData(node, res);
  } else if (node.modelLabel === "forward") {
    const res: UniversalReponse<GatewayForwardResponse[]> =
      await getGatewayForwardData(node.nodeId);
    return formatterChannelData(node, res);
  } else {
    return [];
  }
}
function formatterChannelData(
  node: any,
  res: UniversalReponse<(GatewayForwardResponse | GatewayAcquisitionResponse)[]>
) {
  if (res.code === 0 && res.data.length) {
    const communication_mode_arr = ["以太网", "串口", "无线"];
    const nodeData = res.data.map((item: any) => {
      const data = {
        modelLabel_id: `${node.modelLabel}_device_${item.channel_id}`,
        modelLabel: `${node.modelLabel}_device`,
        gatewayId: node.nodeId,
        nodeId: item.channel_id,
        nodeName: item.channel_name,
        communication_mode:
          node.modelLabel === "acquisition"
            ? communication_mode_arr[item.communication_mode - 1]
            : undefined,
        isLeaf: true,
        children: [],
      };
      return data;
    });
    node.children = nodeData;
    return nodeData;
  } else {
    return [];
  }
}

async function nodeClick(item: any, e: any) {
  currentNode.value = item;
  searchValue.value = "";
  currentPage.value = 1;
  pageSize.value = 10;
  totalCount.value = 0;
  tableData.value = [];
  refreshTable();
  if (item.modelLabel === "all") {
    tableColumn.value = _.cloneDeep(mainTableColumn);
    getGatewayMainDataList();
  } else if (item.modelLabel === "gateway") {
    searchValue.value = "";
    tableColumn.value = _.cloneDeep(mainTableColumn);
    querySingleGateway(item.nodeId);
  } else if (item.modelLabel === "acquisition") {
    tableColumn.value = _.cloneDeep(acquisitionTableColumn);
    const res: UniversalReponse<GatewayAcquisitionResponse[]> =
      await getGatewayAcquisitionData(item.nodeId);
    if (res.code === 0 && res.data.length) {
      totalCount.value = res.total as number;
      tableData.value = res.data;
    } else {
      totalCount.value = 0;
      tableData.value = [];
    }
  } else if (item.modelLabel === "forward") {
    tableColumn.value = _.cloneDeep(forwardTableColumn);
    const res: UniversalReponse<GatewayForwardResponse[]> =
      await getGatewayForwardData(item.nodeId);
    if (res.code === 0 && res.data.length) {
      totalCount.value = res.total as number;
      tableData.value = res.data;
    } else {
      totalCount.value = 0;
      tableData.value = [];
    }
  } else if (
    item.modelLabel === "acquisition_device" ||
    item.modelLabel === "forward_device"
  ) {
    if (item.modelLabel === "forward_device") {
      tableColumn.value = _.cloneDeep(deviceForwardTableColumn);
    } else if (
      item.modelLabel === "acquisition_device" &&
      item.communication_mode === "串口"
    ) {
      tableColumn.value = _.cloneDeep(deviceAcquisitionSerialColumn);
    } else if (
      item.modelLabel === "acquisition_device" &&
      item.communication_mode === "以太网"
    ) {
      tableColumn.value = _.cloneDeep(deviceAcquisitionEthernetColumn);
    }
    const res: UniversalReponse<channelDeviceResponse[]> =
      await getGatewayChannelDeviceData(item.gatewayId, {
        channel_type: item.modelLabel === "acquisition_device" ? 1 : 2,
        channel_id: item.nodeId,
      });
    if (res.code === 0 && res.data.length) {
      totalCount.value = res.total as number;
      tableData.value = res.data;
    } else {
      totalCount.value = 0;
      tableData.value = [];
    }
  }
}

const isShowTable = ref<boolean>(true);
const tableStyle = computed(() => {
  let hei =
    currentNode.value.modelLabel === "all"
      ? "104px"
      : currentNode.value.modelLabel === "acquisition_device" ||
        currentNode.value.modelLabel === "forward_device"
      ? "36px"
      : "10px";
  return { height: `calc(100% - ${hei})` };
});

const isShowTree = ref<boolean>(true);
async function refreshMainTable() {
  if (gatewayInfoType.value === "create") {
    if ((totalCount.value / pageSize.value) % 1 !== 0) {
      currentPage.value = Math.ceil(totalCount.value / pageSize.value);
    } else {
      currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
    }
  }
  if (currentNode.value) {
    isShowTree.value = false;
    currentNode.value = {
      modelLabel_id: "all_0",
      nodeId: 0,
      nodeName: "网关列表",
      modelLabel: "all",
      isLeaf: false,
      children: [],
    };

    nextTick(() => {
      isShowTree.value = true;
      treeRef.value?.setCurrentNode(currentNode.value, false);
    });
  }
  await getGatewayMainDataList();
}

/* 强制表格刷新 */
function refreshTable() {
  isShowTable.value = false;
  nextTick(() => {
    isShowTable.value = true;
  });
}

const gatewayTypeValue = ref<number>(0);
const gatewayTypeOptions = ref<{ id: number; name: string }[]>([
  { id: 0, name: "全部" },
]);
function changeGatewayType(val: number) {
  currentPage.value = 1;
  pageSize.value = 10;
  totalCount.value = 0;
  tableData.value = [];
  getGatewayMainDataList();
}
async function getAllTypesDate() {
  gatewayTypeOptions.value = [{ id: 0, name: "全部" }];
  const resDevice: UniversalReponse<GatewayModelResponse[]> =
    await getGatewayModelList();
  if (resDevice.code === 0 && resDevice.data?.length) {
    resDevice.data.forEach((item) => {
      const param = {
        id: item.GatewayModel,
        name: item.GatewayModelName,
      };
      gatewayTypeOptions.value.push(param);
    });
  }
}

const stationValue = ref<number>(0);
const stationOptions = ref<{ id: number; name: string }[]>([]);
async function getChannelOption() {
  stationOptions.value = [{ id: 0, name: "全部" }];
  const res = await getNetworkNodes();
  if (res.code === 0 && res.data.length) {
    res.data.forEach((item) => {
      stationOptions.value.push({ id: item.nodeId, name: item.nodeName });
    });
  }
}
function changeStation(val: number) {
  currentPage.value = 1;
  pageSize.value = 10;
  totalCount.value = 0;
  tableData.value = [];
  getGatewayMainDataList();
}

const ipValue = ref<string>("");
function ipChannel() {
  getGatewayMainDataList();
}

function importGateway() {}
function exportGateway() {}
function addNewGateway() {
  isShowEditGateway.value = true;
  gatewayInfoType.value = "create";
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

const tableData = ref<any>([]);
const tableColumn = ref<any>(mainTableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
async function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  if (currentNode.value.modelLabel === "all") {
    getGatewayMainDataList();
  } else if (
    currentNode.value.modelLabel === "acquisition_device" ||
    currentNode.value.modelLabel === "forward_device"
  ) {
    const res: UniversalReponse<channelDeviceResponse[]> =
      await getGatewayChannelDeviceData(currentNode.value.gatewayId, {
        channel_type:
          currentNode.value.modelLabel === "acquisition_device" ? 1 : 2,
        channel_id: currentNode.value.nodeId,
      });
    if (res.code === 0 && res.data.length) {
      totalCount.value = res.total as number;
      tableData.value = res.data;
    } else {
      totalCount.value = 0;
      tableData.value = [];
    }
  }
}
async function currentChange(val: number) {
  currentPage.value = val;
  if (currentNode.value.modelLabel === "all") {
    getGatewayMainDataList();
  } else if (
    currentNode.value.modelLabel === "acquisition_device" ||
    currentNode.value.modelLabel === "forward_device"
  ) {
    const res: UniversalReponse<channelDeviceResponse[]> =
      await getGatewayChannelDeviceData(currentNode.value.gatewayId, {
        channel_type:
          currentNode.value.modelLabel === "acquisition_device" ? 1 : 2,
        channel_id: currentNode.value.nodeId,
      });
    if (res.code === 0 && res.data.length) {
      totalCount.value = res.total as number;
      tableData.value = res.data;
    } else {
      totalCount.value = 0;
      tableData.value = [];
    }
  }
}
async function getGatewayMainDataList() {
  const param = {
    page_size: pageSize.value,
    page: currentPage.value,
    gateway_model: gatewayTypeValue.value,
    station_id: stationValue.value,
    gateway_name: searchValue.value,
    ip: ipValue.value ? ipValue.value : undefined,
  };
  const res: UniversalReponse<GatewayMainResponse[]> =
    await getGatewayMainData(param);
  if (res.code === 0 && res.data.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

async function querySingleGateway(gateway_id: number) {
  const res: UniversalReponse<GatewayMainResponse> =
    await getSingleGateway(gateway_id);
  if (res.code === 0) {
    totalCount.value = 1;
    tableData.value = [res.data];
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

function handleEdit(row: any) {
  let modelLabel = currentNode.value.modelLabel;
  if (modelLabel === "acquisition") {
    currentRow = _.cloneDeep(
      Object.assign(row, { gateway_id: currentNode.value.nodeId })
    );
    isShowEditAcquisition.value = true;
  }
  if (modelLabel === "forward") {
    currentRow = _.cloneDeep(
      Object.assign(row, { gateway_id: currentNode.value.nodeId })
    );
    isShowEditForward.value = true;
  }
  if (modelLabel === "all" || modelLabel === "gateway") {
    currentRow = _.cloneDeep(row);
    isShowEditGateway.value = true;
    gatewayInfoType.value = "edit";
  }
}
async function refreshAcquisition() {
  const res: UniversalReponse<GatewayAcquisitionResponse[]> =
    await getGatewayAcquisitionData(currentNode.value.nodeId);
  if (res.code === 0 && res.data?.length) {
    tableData.value = res.data;
  } else {
    tableData.value = [];
  }
  const treeData = formatterChannelData(currentNode.value, res);
  //   const treeData = await queryChannelData(currentNode.value);
  treeData.forEach((item) => {
    treeRef.value!.remove(item);
  });
  nextTick(() => {
    treeRef.value!.updateKeyChildren(
      currentNode.value.modelLabel_id,
      treeData.map((item) => ({
        ...item,
      }))
    );
  });
}

async function refreshForward() {
  const res: UniversalReponse<GatewayForwardResponse[]> =
    await getGatewayForwardData(currentNode.value.nodeId);
  if (res.code === 0 && res.data?.length) {
    tableData.value = res.data;
  } else {
    tableData.value = [];
  }
  const treeData = formatterChannelData(currentNode.value, res);
  //   const treeData = await queryChannelData(currentNode.value);
  treeData.forEach((item) => {
    treeRef.value!.remove(item);
  });
  nextTick(() => {
    treeRef.value!.updateKeyChildren(
      currentNode.value.modelLabel_id,
      treeData.map((item) => ({
        ...item,
      }))
    );
  });
}

function handleEditAdvance(row: any) {
  currentRow = Object.assign(row, { gateway_id: currentNode.value.nodeId });
  isShowEditAcAdvance.value = true;
}
function handleDetail(row: any) {
  currentRow = Object.assign(row, { gateway_id: currentNode.value.nodeId });
  isShowDetail.value = true;
}
async function beforeChange() {
  const mesbox: string = await ElMessageBox.confirm(
    "是否更换该通道启用状态",
    "提醒",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  if (mesbox === "confirm") {
    return true;
  } else {
    return false;
  }
}

async function changeEnabled(
  modelLabel: string,
  parentNodeId: number,
  row: GatewayForwardResponse
) {
  const param = {
    channel_id: row.channel_id,
    enabled: row.enabled,
  };
  if (modelLabel === "acquisition") {
    const res = await enableAcquisitions(parentNodeId, param);
    if (res.code === 0) {
      ElMessage.success("更改采集通道状态成功！");
      refreshAcquisition();
    } else {
      row.enabled = !row.enabled;
    }
  } else if (modelLabel === "forward") {
    const res = await enableForwards(parentNodeId, param);
    if (res.code === 0) {
      ElMessage.success("更改转发通道状态成功！");
      refreshForward();
    } else {
      row.enabled = !row.enabled;
    }
  }
}

function handleGatewayEdit(id: number, name: string) {
  emit("infoEvent", "info", id);
}
async function handleAsyncGateway(id: number, name: string) {
  const res = await syncGateway({ gateway_id: id, is_rebuild: true });
  if (res.code === 0) {
    ElMessage.success("同步更改成功");
    if (currentNode.value.modelLabel === "all") {
      getGatewayMainDataList();
    } else if (currentNode.value.modelLabel === "gateway") {
      querySingleGateway(currentNode.value.nodeId);
    }
  }
}
async function handleGatewayDelete(id: number) {
  const mesbox: string = await ElMessageBox.confirm(
    "确定是否删除该网关",
    "提醒",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  if (mesbox === "confirm") {
    const res = await deleteGateway([id]);
    if (res.code === 0) {
      ElMessage.success("网关删除成功");
      getGatewayMainDataList();
      refreshMainTable();
    }
  }
}

function handleAcquisitionEdit(id: number, name: string) {}
function handleAcquisitionAdvancedEdit(id: number, name: string) {}

function handleForwardCheck(id: number) {}

function forwardInfoEvent(val: any) {
  currentForwardInfo = val;
}
function editEvent() {
  isShowDetail.value = false;
  isShowEditForward.value = true;
}
function detailEvent() {
  isShowDetail.value = true;
  isShowEditForward.value = false;
}
const searchValue = ref<string>("");
function searchChannel() {
  getGatewayMainDataList();
}

async function refreashMainData() {
  currentPage.value = 1;
  pageSize.value = 10;
  totalCount.value = 0;
  tableData.value = [];
  tableColumn.value = _.cloneDeep(mainTableColumn);
  currentNode.value = {
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "网关列表",
    modelLabel: "all",
    isLeaf: false,
    children: [],
  };
  nextTick(() => {
    isShowTree.value = false;
    nextTick(() => {
      isShowTree.value = true;
      //   treeRef.value!.setCurrentNode(currentNode.value, false);
    });
  });
  await getAllTypesDate();
  await getChannelOption();
  getGatewayMainDataList();
}

onActivated(async () => {
  await refreashMainData();
});

defineExpose({
  isShowDetail,
  isShowEditForward,
  refreashMainData,
});
</script>
<style lang="scss" scoped>
.gatewayManagement-tree {
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
