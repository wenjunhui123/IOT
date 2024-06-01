<template>
  <div class="h-full w-full px-6 bg-BG1">
    <div class="w-full h-[55px] leading-[56px]">
      <div class="float-left cursor-pointer" @click="close">
        <DArrowLeft
          style="width: 20px; height: 20px; margin-right: 8px"
        ></DArrowLeft>
        <span class="text-T2 text-[18px] font-medium">{{ title }}</span>
      </div>
      <el-button
        class="float-right mt-3 mr-2"
        type="primary"
        @click="handleEdit"
        >编辑</el-button
      >
    </div>
    <div
      v-for="(box, idx) in boxs"
      :key="idx"
      class="pt-[16px] border-t border-BG"
    >
      <div class="text-T2 text-[16px] font-medium">{{ box.title }}</div>
      <div class="flex mt-4 flex-wrap max-h-[72px] h-full">
        <div
          v-for="(item, index) in box.list"
          :key="index"
          class="h-[20px] mr-[24px] mb-4 inline-block w-[296px]"
        >
          <span class="text-T4 text-[14px]] mr-2">{{ item.label }}</span>
          <el-tooltip
            v-if="item.name === 'product_name'"
            class="box-item"
            effect="dark"
            :content="item.value"
            placement="top-start"
          >
            <span
              class="text-T2 text-[14px] inline-block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap leading-[12px]"
              >{{ item.value }}</span
            >
          </el-tooltip>
          <span v-else class="text-T2 text-[14px]">{{ item.value }}</span>
        </div>
        <div
          v-if="idx === 0"
          class="text-ZS ml-2 cursor-pointer"
          @click="checkChannel"
        >
          查看
        </div>
      </div>
    </div>
    <!-- <div><span class="text-T4 text-[14px]] mr-2">备注：</span><span class="text-T2 text-[14px]">{{ notes }}</span></div> -->
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { DArrowLeft } from "@element-plus/icons-vue";
import { getForwardDetail, getStorageIntervalList } from "@/api/gatewayManage";
import type { ForwardDetailResponse } from "@/api/gatewayManage/types";
import { useChannelStore } from "@/stores/channel";
const channelStore = useChannelStore();
import _ from "lodash";

/*
  事件定义
  */
const emit = defineEmits([
  "editEidt",
  "infoEvent",
  "update:modelValue",
  "success",
]);

const props = defineProps({
  currentNode: {
    type: Object,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const baseInfo = ref([
  { name: "channel_name", label: "通道名称：", value: "--" },
  { name: "protocol_desc", label: "规约类型：", value: "--" },
  { name: "communication_mode", label: "通信方式：", value: "--" },
  {
    name: "port",
    label: "端口号：",
    value: "--",
  },
  { name: "storage_interval_name", label: "存储周期：", value: "--" },
  { name: "station_name", label: "关联厂站：", value: "--" },
  { name: "station_channel_name", label: "主站关联通道名称：", value: "--" },
]);
const ModbusBase = ref([
  { name: "peer_ip_1", label: "主站IP1：", value: "--" },
  { name: "peer_ip_2", label: "主站IP2：", value: "--" },
  { name: "peer_ip_3", label: "主站IP3：", value: "--" },
  { name: "peer_ip_4", label: "主站IP4：", value: "--" },
  { name: "peer_ip_5", label: "主站IP5：", value: "--" },
]);
const CetcloudBase = ref([
  { name: "server", label: "主站地址：", value: "--" },
  { name: "server_bk", label: "备站地址：", value: "--" },
  { name: "port", label: "主站端口：", value: "--" },
  { name: "port_bk", label: "备站端口：", value: "--" },
  { name: "token", label: "登录注册码：", value: "--" },
]);
const ModbusAdvanced = ref([
  {
    name: "is_data_keep",
    label: "是否保留通信:",
    value: "--",
  },
  {
    name: "is_double_alive",
    label: "是否支持双活:",
    value: "--",
  },

  {
    name: "idle_time",
    label: "空闲断线时间(min):",
    value: "--",
  },
  {
    name: "commu_id",
    label: "通信ID:",
    value: "--",
  },

  {
    name: "eth_list",
    label: "以太网采集口列表:",
    value: "--",
  },
  {
    name: "delay_time",
    label: "复位后数据上传等待时间:",
    value: "--",
  },
  {
    name: "res",
    label: "备注:",
    value: "--",
  },
]);
const CetCloudAdvanced = ref([
  {
    name: "is_data_keep",
    label: "是否保留通信:",
    value: "--",
  },

  {
    name: "is_tls",
    label: "是否TSL加密:",
    value: "--",
  },
  {
    name: "idle_time",
    label: "空闲断线时间(min):",
    value: "--",
  },

  {
    name: "delay_time",
    label: "复位后数据上传等待时间:",
    value: "--",
  },
  {
    name: "res",
    label: "备注:",
    value: "--",
  },
]);
const boxs = ref([
  {
    title: "基本信息",
    list: baseInfo.value,
  },
  {
    title: "基本参数",
    list: [],
  },
  {
    title: "高级参数",
    list: [],
  },
]);
const notes = ref<string>("");
const title = ref<string>("查看详情");
const storageOptions = ref<any>([]);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        // getStorageInterval();
        queryDetail();
      });
    } else {
      nextTick(() => {
        boxs.value.forEach((box) => {
          box.list.forEach((ite) => {
            ite.value = "--";
          });
        });
      });
    }
  },
  { deep: true, immediate: true }
);

function checkChannel() {
  if (!props.currentNode.station_channel_id) {
    return ElMessage.warning("暂未关联通道，不可跳转！");
  }
  let node = {
    nodeId: props.currentNode.station_channel_id,
    portalMode: "",
    portType: props.currentNode.communication_mode === 1 ? "ETHERNET" : "COM",
  };
  channelStore.changeChannelNode(node);
  channelStore.changeJumpChannelStatus(true);
  router.push({
    name: "ChannelManagement",
  });
}
async function handleEdit() {
  emit("editEvent");
}

function close() {
  emit("update:modelValue", false);
  emit("success");
}
async function queryDetail() {
  let gateway_id = props.currentNode.gateway_id;
  let channel_id = props.currentNode.channel_id;
  const res: UniversalReponse<ForwardDetailResponse> = await getForwardDetail(
    gateway_id,
    channel_id
  );
  if (res.code === 0 && res.data) {
    let isModbus =
      res.data.protocol_desc === "深圳中电ModbusTCP协议" ? true : false;
    let advancedList = isModbus ? ModbusAdvanced.value : CetCloudAdvanced.value;
    let baseList = isModbus ? ModbusBase.value : CetcloudBase.value;

    baseInfo.value.forEach(async (item) => {
      item.value = res.data[item.name] ? res.data[item.name] : "--";
      if (item.name === "communication_mode") {
        // 1，以太网；2，串口
        item.value = res.data[item.name] === 1 ? "以太网" : "串口";
      }
      if (item.name === "storage_interval_name") {
        // let obj = storageOptions.value.find(
        //   (i) => i.interval === res.data.storage_interval
        // );
        // item.value = obj ? obj.text : "--";
        item.value = res.data.storage_interval_name
          ? res.data.storage_interval_name
          : "--";
      }
    });

    boxs.value[1].list = baseList.map((item) => {
      item.value = res.data["basic_para_list"][item.name]
        ? res.data["basic_para_list"][item.name]
        : "--";
      return item;
    });

    boxs.value[2].list = advancedList.map((item) => {
      let boolNames = ["is_double_alive", "is_data_keep", "is_tls"];
      let value = res.data["advance_para_list"][item.name];
      item.value = value ? value : "--";
      if (boolNames.includes(item.name) && !_.isNil(item.value)) {
        item.value = value ? "是" : "否";
      }
      return item;
    });
    // notes.value = res.data.advance_para_list.res;

    emit("infoEvent", res.data);
  }
}

async function getStorageInterval() {
  const res: UniversalReponse<any[]> = await getStorageIntervalList(
    props.currentNode.gateway_id
  );
  if (res.code === 0 && res.data?.length) {
    storageOptions.value = res.data;
  } else {
    storageOptions.value = [];
  }
}
</script>
<style scoped lang="scss">
.info-tabs {
  height: calc(100% - 172px);
  :deep(.el-tabs__item) {
    height: 56px !important;
  }
  :deep(.el-tab-pane) {
    height: 100%;
  }
  :deep(.el-tabs__content) {
    height: calc(100% - 56px);
  }
}
</style>
