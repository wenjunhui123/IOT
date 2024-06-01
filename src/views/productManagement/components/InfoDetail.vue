<template>
  <div class="h-full px-6">
    <div class="w-full h-[55px] border-b-[1px] border-BG leading-[56px]">
      <div class="float-left cursor-pointer" @click="close">
        <DArrowLeft
          style="width: 20px; height: 20px; margin-right: 8px"
        ></DArrowLeft>
        <span class="text-T2 text-[18px] font-medium">{{ title }}</span>
      </div>
      <div
        v-if="is_release"
        class="float-left box-border mt-3 leading-6 px-2 py-1 cursor-alias ml-4 rounded-[3px] h-[28px] bg-[rgba(41,176,97,0.1)] text-[#29B061] text-[12px]"
      >
        已上线
      </div>
      <div
        v-else
        class="float-left box-border mt-3 leading-6 px-2 py-1 cursor-alias ml-4 rounded-[3px] h-[28px] bg-[rgba(249,94,90,0.1)] text-[rgba(249,94,90,0.57)] text-[12px]"
      >
        未上线
      </div>
      <el-button
        v-if="false"
        class="float-right mt-3"
        type="primary"
        @click="close"
        >关闭</el-button
      ><el-button
        class="float-right mt-3 mr-2"
        type="primary"
        @click="productRelease"
        >发布产品</el-button
      >
    </div>
    <div class="h-[calc(100%-56px)] py-6 box-border infoDetailContent">
      <div class="px-4 h-full">
        <div class="font-medium h-[20px] text-[16px] text-T1 mb-4">
          <span class="mr-4">基础信息</span>
          <span class="text-ZS cursor-pointer" @click="handleEdit"
            >编辑<EditPen class="text-ZS w-[14px] h-[14px] ml-[6px]"></EditPen
          ></span>
        </div>
        <div class="flex mt-4 flex-wrap max-h-[72px] overflow-y-auto">
          <div
            v-for="(item, index) in productInfo.slice(
              0,
              productInfo.length - 1
            )"
            :key="item.name"
            class="h-[20px] mr-[24px] mb-4"
            :style="{ width: (index + 1) % 4 === 0 ? '450px' : '320px' }"
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
        </div>
        <div class="flex max-h-[48px] overflow-y-auto">
          <div class="text-T4 text-[14px]] mr-2">
            {{ productInfo[productInfo.length - 1].label }}
          </div>
          <div class="text-T2 text-[14px]] flex-1">
            {{ productInfo[productInfo.length - 1].value }}
          </div>
        </div>
        <el-tabs
          v-model="activeName"
          class="info-tabs mt-4"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="real-time-measure-points"
            name="real-time-measure-points"
            lazy
          >
            <template #label>
              <div class="w-[180px] h-[56px] flex justify-center items-center">
                <img
                  class="w-[32px] h-[32px] mr-4"
                  src="../assets/real-time-measure-points.svg"
                  alt="实时测点"
                  title="实时测点"
                />
                <span>实时测点</span>
              </div>
            </template>
            <MeasurePointsMainTable
              ref="measurePointsMainTableRef"
              v-if="activeName === 'real-time-measure-points'"
              @ok="getProductInfo"
            ></MeasurePointsMainTable>
          </el-tab-pane>
          <el-tab-pane
            lazy
            label="device-time-record"
            name="device-time-record"
          >
            <template #label>
              <div class="w-[180px] h-[56px] flex justify-center items-center">
                <img
                  class="w-[32px] h-[32px] mr-4"
                  src="../assets/device-time-record.svg"
                  alt="装置定时记录"
                  title="装置定时记录"
                />
                <span>装置定时记录</span>
              </div>
            </template>
            <DeviceTimingRecord
              v-if="activeName === 'device-time-record'"
            ></DeviceTimingRecord>
          </el-tab-pane>
          <el-tab-pane lazy label="remote-control" name="remote-control">
            <template #label>
              <div class="w-[180px] h-[56px] flex justify-center items-center">
                <img
                  class="w-[32px] h-[32px] mr-4"
                  src="../assets/remote-control.svg"
                  alt="遥控"
                  title="遥控"
                />
                <span>遥控</span>
              </div>
            </template>
            <RemoteControl
              v-if="activeName === 'remote-control'"
            ></RemoteControl>
          </el-tab-pane>
          <el-tab-pane lazy label="alarm-template" name="alarm-template">
            <template #label>
              <div class="w-[180px] h-[56px] flex justify-center items-center">
                <img
                  class="w-[32px] h-[32px] mr-4"
                  src="../assets/alarm-template.svg"
                  alt="告警模板"
                  title="告警模板"
                />
                <span>告警模板</span>
              </div>
            </template>
            <AlarmTemplate
              v-if="activeName === 'alarm-template'"
            ></AlarmTemplate>
          </el-tab-pane>
          <el-tab-pane
            lazy
            label="extended-protocol-configuration"
            name="extended-protocol-configuration"
          >
            <template #label>
              <div class="w-[180px] h-[56px] flex justify-center items-center">
                <img
                  class="w-[32px] h-[32px] mr-4"
                  src="../assets/extended-protocol-configuration.svg"
                  alt="扩展规约配置"
                  title="扩展规约配置"
                />
                <span>扩展规约配置</span>
              </div>
            </template>
            <ExtendedProtocolConfiguration
              v-if="activeName === 'extended-protocol-configuration'"
            ></ExtendedProtocolConfiguration>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <CreateOrEditCustomProducts
      v-model="isShowCustomProducts"
      infoType="edit"
      :node="currentCustomProductsNode"
      @ok="getProductInfo"
    ></CreateOrEditCustomProducts>
    <ReleaseConfirmation
      v-model="isShowReleaseConfirmation"
      :node="currentCustomProductsNode"
      @ok="getProductInfo"
    ></ReleaseConfirmation>
  </div>
</template>
<script setup lang="ts">
import { DArrowLeft } from "@element-plus/icons-vue";
import { EditPen } from "@element-plus/icons-vue";
import MeasurePointsMainTable from "./measurePoints/index.vue";
import DeviceTimingRecord from "./deviceTimingRecord/index.vue";
import ReleaseConfirmation from "./ReleaseConfirmation.vue";
import RemoteControl from "./remoteControl/index.vue";
import AlarmTemplate from "./alarmTemplate/index.vue";
import ExtendedProtocolConfiguration from "./extendedProtocolConfiguration/index.vue";
import { getProductDataInfo, productVersion } from "@/api/productManage/index";
import type {
  ProductDataInfo,
  ProductVersionResponse,
} from "@/api/productManage/types";
import CreateOrEditCustomProducts from "./CreateOrEditCustomProducts.vue";
import moment from "moment";

/*
事件定义
*/
const emit = defineEmits(["infoEvent"]);

const props = withDefaults(
  defineProps<{
    productId: number;
    isShowInfo: boolean;
  }>(),
  {
    productId: 0,
    isShowInfo: false,
  }
);

watch(
  () => [props.productId, props.isShowInfo],
  ([newVal, newVal1], [oldVal, oldVal1]) => {
    nextTick(() => {
      if (newVal && newVal1) {
        emptyData();
        getProductInfo();
        measurePointsMainTableRef.value.initData();
      }
    });
  }
);

const isShowReleaseConfirmation = ref<boolean>(false);
const isShowCustomProducts = ref<boolean>(false);
const productInfo = ref([
  { name: "product_name", label: "产品名称：", value: "--" },
  { name: "device_type_name", label: "设备类型：", value: "--" },
  { name: "create_time", label: "创建时间：", value: "--" },
  {
    name: "product_uuid",
    label: "产品唯一ID：",
    value: "--",
  },
  { name: "product_type_name", label: "产品类型：", value: "--" },
  { name: "driver_type_name", label: "驱动类型：", value: "--" },
  {
    name: "update_time",
    label: "最后修改时间：",
    value: "--",
  },
  { name: "product_version", label: "当前配置版本：", value: "--" },
  {
    name: "description",
    label: "产品描述：",
    value: "--",
  },
]);

const activeName = ref<string>("real-time-measure-points");
watch(
  () => activeName.value,
  (val) => {
    if (val === "real-time-measure-points") {
      nextTick(() => {
        measurePointsMainTableRef.value.initData();
      });
    }
  },
  { immediate: false }
);
function handleClick() {}

const measurePointsMainTableRef = ref<any>(null);

function handleEdit() {
  isShowCustomProducts.value = true;
}

const title = ref<string>("产品详情");
const currentCustomProductsNode = ref<ProductDataInfo>();

const is_release = ref<boolean>(false);
async function getProductInfo(
  refreshTable: boolean = false,
  refreshMeasurePoint: boolean = false
) {
  let res: UniversalReponse<ProductDataInfo> = await getProductDataInfo(
    props.productId
  );
  if (res.code === 0) {
    currentCustomProductsNode.value = res.data;
    is_release.value = res.data.is_release;
    for (let i = 0; i < productInfo.value.length; i++) {
      let item = productInfo.value[i];
      if (res.data[item.name]) {
        if (item.name === "create_time" || item.name === "update_time") {
          item.value = moment(res.data[item.name]).format(
            "YYYY/MM/DD HH:mm:ss"
          );
        } else {
          item.value = res.data[item.name];
        }
      } else if (item.name === "product_type_name") {
        item.value = ["直采", "网关子设备"][res.data.product_type - 1];
      } else {
        item.value = "--";
      }
    }
    if (refreshTable) {
      emit("infoEvent", "refreshMain");
    }
    if (refreshMeasurePoint) {
      measurePointsMainTableRef.value.initData();
    }
  }
}

async function productRelease() {
  if (currentCustomProductsNode.value) {
    if (
      !currentCustomProductsNode.value.product_type ||
      !currentCustomProductsNode.value.device_type ||
      !currentCustomProductsNode.value.driver_type
    ) {
      return ElMessage.warning(
        "只有设备类型/驱动类型/产品类型全部不为空才可发布！"
      );
    }
  }
  isShowReleaseConfirmation.value = true;
}

function emptyData() {
  productInfo.value = [
    { name: "product_name", label: "产品名称：", value: "--" },
    { name: "device_type_name", label: "设备类型：", value: "--" },
    { name: "create_time", label: "创建时间：", value: "--" },
    {
      name: "product_uuid",
      label: "产品唯一ID：",
      value: "--",
    },
    { name: "product_type_name", label: "产品类型：", value: "--" },
    { name: "driver_type_name", label: "驱动类型：", value: "--" },
    {
      name: "update_time",
      label: "最后修改时间：",
      value: "--",
    },
    { name: "product_version", label: "当前配置版本：", value: "--" },
    {
      name: "description",
      label: "产品描述：",
      value: "--",
    },
  ];
}

function close() {
  emit("infoEvent", "main");
}

defineExpose({
  activeName,
});
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
