<template>
  <el-dialog
    custom-class="productManagement-associateDevicesPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <div class="p-6 bg-BG1 h-[668px] overflow-auto">
      <el-input
        size="small"
        placeholder="请输入关键字"
        :suffix-icon="Search"
        v-model="baseFilterText"
      />
      <el-tree
        class="mt-2 h-[calc(100%-48px)]"
        ref="treeRef"
        show-checkbox
        :highlight-current="true"
        :props="defaultProps"
        :current-node-key="currentNode.modelLabel_id"
        node-key="modelLabel_id"
        :data="devicesTree"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      />
    </div>

    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElTree } from "element-plus";
import { Search, Watch } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { AlarmTemplate } from "./rules";
import {
  getEventModelDevicesTree,
  createEventModelDevices,
  deleteEventModelDevices,
} from "@/api/productManage/index";
import type { EventModelDevicesTreeResponse } from "@/api/productManage/types";
import _ from "lodash-es";

const productId: any = inject<number>("productId");

/*
  事件定义
  */
const emit = defineEmits(["update:modelValue", "ok"]);

/*
  弹窗显隐控制及弹窗
  */
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    currentTemplate: AlarmTemplate;
  }>(),
  {
    modelValue: false,
  }
);
const show = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        queryEventModelDevicesTree();
      });
    }
  },
  { immediate: true }
);

const dialogConfig = reactive({
  title: "关联设备",
  width: "480px",
});

const baseFilterText = ref("");
watch(baseFilterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
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
  isChecked: boolean;
  disabled: boolean;
  newSelected: boolean;
  newDeleted: boolean;
  parentNodeId?: number;
  children?: DataTree[];
  parentNodeModelLabelId?: string;
}

const currentNode = ref<DataTree>({
  modelLabel_id: "station_0",
  nodeId: 0,
  nodeName: "全部厂站",
  modelLabel: "all",
  isLeaf: false,
  isChecked: false,
  disabled: false,
  newSelected: false,
  newDeleted: false,
  children: [],
});
const devicesTree = ref<DataTree[]>([
  {
    modelLabel_id: "station_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    isChecked: false,
    disabled: false,
    newSelected: false,
    newDeleted: false,
    children: [],
  },
]);
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  children: "children",
  label: "nodeName",
  value: "modelLabel_id",
  isLeaf: "isLeaf",
  disabled: "disabled",
};

function nodeClick(item: any) {
  currentNode.value = item;
}
const chooseCheckedTreeData = ref<DataTree[]>([]);
const getCheckedTreeData = ref<DataTree[]>([]);

async function queryEventModelDevicesTree() {
  devicesTree.value = [
    {
      modelLabel_id: "station_0",
      nodeId: 0,
      nodeName: "全部厂站",
      modelLabel: "all",
      isLeaf: false,
      isChecked: false,
      disabled: false,
      newSelected: false,
      newDeleted: false,
      children: [],
    },
  ];
  const checkedDeviceList: DataTree[] = [];
  getCheckedTreeData.value = [];
  chooseCheckedTreeData.value = [];
  const param = {
    product_id: productId.value,
    event_model_id: props.currentTemplate.id,
  };
  const res: UniversalReponse<EventModelDevicesTreeResponse> =
    await getEventModelDevicesTree(param);
  if (res.code === 0 && res.data.stations.length) {
    const treeData = res.data.stations.map((station) => {
      const stationData: DataTree = {
        modelLabel_id: `station_${station.station_id}`,
        nodeId: station.station_id,
        nodeName: station.station_name,
        modelLabel: "station",
        isLeaf: false,
        isChecked: false,
        disabled: false,
        newSelected: false,
        newDeleted: false,
        parentNodeModelLabelId: "all_0",
        children: [],
      };
      if (station.channels?.length) {
        stationData.children = station.channels?.map((channel) => {
          const channelData: DataTree = {
            modelLabel_id: `channel_${channel.channel_id}`,
            nodeId: channel.channel_id,
            nodeName: channel.channel_name,
            modelLabel: "channel",
            isLeaf: false,
            isChecked: false,
            disabled: false,
            newSelected: false,
            newDeleted: false,
            parentNodeModelLabelId: `station_${stationData.nodeId}`,
            children: [],
          };
          if (channel.devices?.length) {
            channelData.children = channel.devices?.map((device) => {
              const deviceData: DataTree = {
                modelLabel_id: `device_${device.device_id}`,
                nodeId: device.device_id,
                nodeName: device.device_name,
                modelLabel: "device",
                isLeaf: true,
                isChecked: device.has_event,
                disabled: false,
                newSelected: false,
                newDeleted: false,
                parentNodeModelLabelId: `device_${channelData.nodeId}`,
              };
              if (deviceData.isChecked) {
                checkedDeviceList.push(deviceData);
                getCheckedTreeData.value.push(deviceData);
              }
              return deviceData;
            });
          }
          return channelData;
        });
      }
      return stationData;
    });
    devicesTree.value[0].children = treeData;
    nextTick(() => {
      checkedDeviceList.forEach((item) => {
        if (item.isChecked) {
          treeRef.value!.setChecked(item.modelLabel_id, true, false);
        } else {
          treeRef.value!.setChecked(item.modelLabel_id, false, false);
        }
      });
    });
  } else {
    devicesTree.value[0].children = [];
  }
}

/* 表单上传模块 */
async function confirm() {
  chooseCheckedTreeData.value = treeRef
    .value!.getCheckedNodes(false)
    .filter((item) => {
      return item.modelLabel === "device";
    }) as DataTree[];
  const newSelected = _.differenceBy(
    chooseCheckedTreeData.value,
    getCheckedTreeData.value,
    "modelLabel_id"
  ).map((ite) => {
    return ite.nodeId;
  });
  const newDeleted = _.differenceBy(
    getCheckedTreeData.value,
    chooseCheckedTreeData.value,
    "modelLabel_id"
  ).map((ite) => {
    return ite.nodeId;
  });
  if (newSelected?.length) {
    const res = await createEventModelDevices({
      product_id: productId.value,
      event_model_id: props.currentTemplate.id,
      device_ids: newSelected,
    });
    if (res.code === 0) {
      ElMessage.success("新增关联设备成功");
    }
  }
  if (newDeleted?.length) {
    const res = await deleteEventModelDevices({
      product_id: productId.value,
      event_model_id: props.currentTemplate.id,
      device_ids: newDeleted,
    });
    if (res.code === 0) {
      ElMessage.success("删除关联设备成功");
    }
  }
  show.value = false;
}
function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-associateDevicesPage {
  margin-top: 6vh;

  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
}
</style>
