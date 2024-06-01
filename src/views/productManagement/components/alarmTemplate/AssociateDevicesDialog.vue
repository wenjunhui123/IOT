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
        v-if="isShowTree"
        ref="treeRef"
        show-checkbox
        :highlight-current="true"
        :props="defaultProps"
        :current-node-key="currentNode.modelLabel_id"
        node-key="modelLabel_id"
        :load="loadNode"
        lazy
        :filter-node-method="filterNode"
        @node-click="nodeClick"
        @check="checkChangeDevices"
      />
    </div>

    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="cancel">取消</el-button>
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
  getEventModelStations,
  getEventModelChannels,
  getEventModelDevices,
  createEventModelDevices,
  deleteEventModelDevices,
} from "@/api/productManage/index";
import type {
  EventModelStationsQuery,
  EventModelStationsResponse,
  EventModelChannelsQuery,
  EventModelChannelsResponse,
  EventModelDevicesQuery,
  EventModelDevicesResponse,
  EventModelDevicesCreateOrDeleteQuery,
} from "@/api/productManage/types";

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
        refreshMainTable();
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
  disabled: true,
  newSelected: false,
  newDeleted: false,
  children: [],
});
const isShowTree = ref<boolean>(true);
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
const checkedTreeData = ref<DataTree[]>([]);
function checkChangeDevices(checkedNodes: DataTree, checkedKeys: any) {
  if (checkedNodes.modelLabel === "device") {
    checkDevicesFun(checkedNodes, checkedKeys);
  } else {
    const checkDevices: DataTree[] = [];
    findAllDevices(checkedNodes, checkedKeys, checkDevices);
    checkDevices.forEach((item) => {
      checkDevicesFun(item, checkedKeys);
    });
  }
}
function checkDevicesFun(checkedNodes: DataTree, checkedKeys: any) {
  const item = checkedKeys.checkedNodes.find((ite: any) => {
    return ite.modelLabel_id === checkedNodes.modelLabel_id;
  });
  const item1 = checkedTreeData.value.find((ite: any) => {
    return ite.modelLabel_id === checkedNodes.modelLabel_id;
  });
  if (!item) {
    if (!checkedNodes.isChecked) {
      checkedTreeData.value = checkedTreeData.value.filter((ite) => {
        return ite.modelLabel_id !== checkedNodes.modelLabel_id;
      });
    } else {
      checkedTreeData.value.forEach((ite) => {
        if (ite.modelLabel_id === checkedNodes.modelLabel_id) {
          ite.newDeleted = true;
        }
      });
    }
  } else {
    if (item1) {
      checkedTreeData.value.forEach((ite) => {
        ite.newDeleted = false;
      });
    } else {
      checkedTreeData.value.push({ ...checkedNodes, newSelected: true });
    }
  }
}

const loadNode = async (node: Node, resolve: (data: DataTree[]) => void) => {
  if (node.level === 0) {
    return resolve([
      {
        modelLabel_id: "all_0",
        nodeId: 0,
        nodeName: "全部厂站",
        modelLabel: "all",
        isLeaf: false,
        isChecked: false,
        disabled: true,
        newSelected: false,
        newDeleted: false,
        children: [],
      },
    ]);
  } else if (node.level === 1) {
    const treeData = await queryEventModelStations(node.data);
    resolve(treeData);
  } else if (node.level === 2) {
    const treeData = await queryEventModelChannels(node.data);
    resolve(treeData);
  } else if (node.level === 3) {
    const treeData = await queryEventModelDevices(node.data);
    resolve(treeData);
  }
};

async function refreshMainTable() {
  checkedTreeData.value = [];
  currentNode.value = {
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    isChecked: false,
    disabled: true,
    newSelected: false,
    newDeleted: false,
    children: [],
  };
  const treeData = await queryEventModelStations({
    modelLabel_id: "all_0",
    nodeId: 0,
    nodeName: "全部厂站",
    modelLabel: "all",
    isLeaf: false,
    isChecked: false,
    disabled: true,
    newSelected: false,
    newDeleted: false,
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

async function queryEventModelStations(node: any) {
  const param = {
    product_id: productId.value,
    event_model_id: props.currentTemplate.id,
  };
  const res: UniversalReponse<EventModelStationsResponse[]> =
    await getEventModelStations(param);
  if (res.code === 0 && res.data.length) {
    const resData = res.data.map((item) => {
      const data = {
        modelLabel_id: `station_${item.station_id}`,
        nodeId: item.station_id,
        nodeName: item.station_name,
        modelLabel: "station",
        isLeaf: false,
        isChecked: item.has_event,
        disabled: false,
        newSelected: false,
        newDeleted: false,
        parentNodeModelLabelId: "all_0",
        children: [],
      };
      if (item.has_event) {
        checkedTreeData.value.push(data);
      }
      node.children.push(data);
      return data;
    });
    nextTick(() => {
      const checked = resData.forEach((item) => {
        if (item.isChecked) {
          treeRef.value!.setChecked(item.modelLabel_id, true, false);
        } else {
          treeRef.value!.setChecked(item.modelLabel_id, false, false);
        }
      });
    });
    return resData;
  } else {
    return [];
  }
}

async function queryEventModelChannels(node: any) {
  const param = {
    product_id: productId.value,
    event_model_id: props.currentTemplate.id,
    station_id: node.nodeId,
  };
  const res: UniversalReponse<EventModelChannelsResponse[]> =
    await getEventModelChannels(param);
  if (res.code === 0 && res.data.length) {
    const resData = res.data.map((item) => {
      const data = {
        modelLabel_id: `channel_${item.channel_id}`,
        nodeId: item.channel_id,
        nodeName: item.channel_name,
        modelLabel: "channel",
        isLeaf: false,
        isChecked: item.has_event,
        disabled: false,
        newSelected: false,
        newDeleted: false,
        parentNodeModelLabelId: `station_${node.nodeId}`,
        children: [],
      };
      if (item.has_event) {
        checkedTreeData.value.push(data);
      }
      node.children.push(data);
      return data;
    });
    nextTick(() => {
      const Checked = resData.forEach((item) => {
        if (item.isChecked) {
          treeRef.value!.setChecked(item.modelLabel_id, true, false);
        } else {
          treeRef.value!.setChecked(item.modelLabel_id, false, false);
        }
      });
    });
    return resData;
  } else {
    return [];
  }
}

async function queryEventModelDevices(node: any) {
  const param = {
    product_id: productId.value,
    event_model_id: props.currentTemplate.id,
    channel_id: node.nodeId,
  };
  const res: UniversalReponse<EventModelDevicesResponse[]> =
    await getEventModelDevices(param);
  if (res.code === 0 && res.data.length) {
    const resData = res.data.map((item) => {
      const data = {
        modelLabel_id: `device_${item.device_id}`,
        nodeId: item.device_id,
        nodeName: item.device_name,
        modelLabel: "device",
        isLeaf: true,
        isChecked: item.has_event,
        disabled: false,
        newSelected: false,
        newDeleted: false,
        parentNodeModelLabelId: `device_${node.nodeId}`,
      };
      if (item.has_event) {
        checkedTreeData.value.push(data);
      }
      node.children.push(data);
      return data;
    });
    nextTick(() => {
      const checked = resData.forEach((item) => {
        if (item.isChecked) {
          treeRef.value!.setChecked(item.modelLabel_id, true, false);
        } else {
          treeRef.value!.setChecked(item.modelLabel_id, false, false);
        }
      });
    });
    return resData;
  } else {
    return [];
  }
}

function findAllDevices(
  node: DataTree,
  checkedKeys: any,
  checkDevices: DataTree[]
) {
  if (node.children?.length) {
    node.children.forEach((item) => {
      findAllDevices(item, checkedKeys, checkDevices);
    });
  } else if (node.modelLabel === "device") {
    checkDevices.push(node);
  }
}

/* 表单上传模块 */
async function confirm() {
  const newSelected = checkedTreeData.value
    .filter((item) => {
      return (
        item.newSelected && !item.isChecked && item.modelLabel === "device"
      );
    })
    .map((ite) => {
      return ite.nodeId;
    });
  const newDeleted = checkedTreeData.value
    .filter((item) => {
      return item.newDeleted && item.isChecked && item.modelLabel === "device";
    })
    .map((ite) => {
      return ite.nodeId;
    });
  if (newSelected?.length) {
    await createEventModelDevices({
      product_id: productId.value,
      event_model_id: props.currentTemplate.id,
      device_ids: newSelected,
    });
  }
  if (newDeleted?.length) {
    await deleteEventModelDevices({
      product_id: productId.value,
      event_model_id: props.currentTemplate.id,
      device_ids: newDeleted,
    });
  }
  ElMessage.success("编辑成功");
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
