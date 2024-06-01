<template>
  <div class="bg-BG1 w-full h-full px-6">
    <div class="w-full h-[55px] border-b-[1px] border-BG leading-[56px]">
      <div
        class="float-left cursor-pointer"
        @click="close"
      >
        <DArrowLeft style="width: 20px; height: 20px; margin-right: 8px"></DArrowLeft>
        <span class="text-T2 text-[18px] font-medium">查看设备</span>
      </div>
    </div>
    <div class="flex mt-4 flex-wrap">
      <div
        v-for="item in deviceInfo"
        :key="item.name"
        class="h-[20px] mr-[40px] mb-4"
      >
        <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.value"
          placement="top-start"
        >
          <span class="text-T2 text-[14px] inline-block max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap leading-[12px]">{{ item.value }}</span>
        </el-tooltip>
        <span
          v-if="item.name === 'product_name'"
          class="text-ZS ml-2 cursor-pointer"
          @click="checkProduct"
        >查看</span>
        <span
          v-if="item.name === 'channel_id'"
          class="text-ZS ml-2 cursor-pointer"
          @click="checkChannel"
        >查看</span>
      </div>
    </div>
    <el-tabs
      v-model="activeName"
      class="info-tabs mt-4"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="data-configuration"
        name="data-configuration"
        lazy
      >
        <template #label>
          <div class="w-[180px] h-[56px] flex justify-center items-center">
            <img
              class="w-[32px] h-[32px] mr-4"
              src="../assets/data-configuration.svg"
              alt="数据配置"
              title="数据配置"
            />
            <span>数据配置</span>
          </div>
        </template>
        <DataConfiguration
          v-if="activeName === 'data-configuration'"
          @updateDeviceInfo="updateDeviceInfo"
        ></DataConfiguration>
      </el-tab-pane>
      <el-tab-pane
        label="data-details"
        name="data-details"
        lazy
      >
        <template #label>
          <div class="w-[180px] h-[56px] flex justify-center items-center">
            <img
              class="w-[32px] h-[32px] mr-4"
              src="../assets/data-details.svg"
              alt="数据详情"
              title="数据详情"
            />
            <span>数据详情</span>
          </div>
        </template>
        <DataDetails v-if="activeName === 'data-details'"></DataDetails>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { DArrowLeft } from "@element-plus/icons-vue";
import { useProductStore } from "@/stores/product";
const productStore = useProductStore();
import { useChannelStore } from "@/stores/channel";
const channelStore = useChannelStore();
import DataConfiguration from "./dataConfiguration/index.vue";
import DataDetails from "./dataDetails/index.vue";
import { getProductDataInfo } from "@/api/deviceInstantiation/index";
import type { DeviceDataInfoResponse } from "@/api/deviceInstantiation/types";

/*
事件定义
*/
const emit = defineEmits(["infoEvent"]);

const props = withDefaults(
  defineProps<{
    deviceId: number;
    isShowInfo: boolean;
  }>(),
  {
    deviceId: 0,
    isShowInfo: false,
  }
);

watch(
  () => [props.deviceId, props.isShowInfo],
  ([newVal, newVal1], [oldVal, oldVal1]) => {
    nextTick(() => {
      if (newVal && newVal1) {
        queryProductDataInfo(newVal as number);
      }
    });
  }
);

const deviceInfo = ref([
  { name: "device_id", label: "设备ID：", value: "--" },
  { name: "product_name", label: "产品名称：", value: "--" },
  { name: "product_type_name", label: "产品类型：", value: "--" },
  { name: "channel_name", label: "关联通道：", value: "--" },
  { name: "portal_mode_name", label: "通道巡检方式：", value: "--" },
  { name: "channel_id", label: "通道ID：", value: "--" },
]);

const deviceInfoDetail = ref<DeviceDataInfoResponse>({
  product_type: 0,
  device_id: 0,
  device_name: "",
  product_id: 0,
  product_name: "",
  device_type_name: "",
  channel_id: 0,
  channel_name: "",
  portal_mode: "",
  port_type: "",
  comm_config: {},
  custom_inf: "",
});

const activeName = ref<string>("data-configuration");
function handleClick() {}

async function queryProductDataInfo(deviceId: number) {
  emptyData();
  const res: UniversalReponse<DeviceDataInfoResponse> =
    await getProductDataInfo({ device_id: deviceId });
  if (res.code === 0 && res.data) {
    deviceInfo.value.forEach((item) => {
      if (item.name === "product_type_name") {
        if (res.data.product_type === 1) {
          item.value = "直采";
        } else if (res.data.product_type === 2) {
          item.value = "网关子设备";
        } else if (res.data.product_type === 3) {
          item.value = "三方设备";
        } else {
          item.value = "--";
        }
      } else if (item.name === "portal_mode_name") {
        if (res.data.portal_mode === "SERIAL") {
          item.value = "串行";
        } else if (res.data.portal_mode === "PARALLEL") {
          item.value = "并行";
        } else {
          item.value = "";
        }
      } else {
        item.value = res.data[item.name] ? res.data[item.name] : "--";
      }
    });
    deviceInfoDetail.value = res.data;
  }
}

function updateDeviceInfo() {
  queryProductDataInfo(props.deviceId);
  //   emit("infoEvent", "refresh");
}

function emptyData() {
  activeName.value = "data-configuration";
  deviceInfo.value = [
    { name: "device_id", label: "设备ID：", value: "--" },
    { name: "product_name", label: "产品名称：", value: "--" },
    { name: "product_type_name", label: "产品类型：", value: "--" },
    { name: "channel_name", label: "关联通道：", value: "--" },
    { name: "portal_mode_name", label: "通道巡检方式：", value: "--" },
    { name: "channel_id", label: "通道ID：", value: "--" },
  ];
  deviceInfoDetail.value = {
    product_type: 0,
    device_id: 0,
    device_name: "",
    product_id: 0,
    product_name: "",
    device_type_name: "",
    channel_id: 0,
    channel_name: "",
    portal_mode: "",
    port_type: "",
    comm_config: {},
    custom_inf: "",
  };
}

function close() {
  emit("infoEvent", "main");
}

function checkProduct() {
  if (!deviceInfoDetail.value.product_id) {
    return ElMessage.warning("暂未关联产品，不可跳转！");
  }
  productStore.changeProductId(deviceInfoDetail.value.product_id);
  productStore.changeJumpProductStatus(true);
  router.push({
    name: "ProductManagement",
  });
}
function checkChannel() {
  if (!deviceInfoDetail.value.channel_id) {
    return ElMessage.warning("暂未关联通道，不可跳转！");
  }
  channelStore.changeChannelNode({
    nodeId: deviceInfoDetail.value.channel_id,
    portalMode: deviceInfoDetail.value.portal_mode,
    portType: deviceInfoDetail.value.port_type,
  });
  channelStore.changeJumpChannelStatus(true);
  router.push({
    name: "ChannelManagement",
  });
}

provide("deviceInfoDetail", deviceInfoDetail);

defineExpose({ queryProductDataInfo });
</script>
<style lang="scss" scoped>
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
