<template>
  <el-tabs
    v-model="activeName"
    class="h-full"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane lazy label="基础配置" name="基础配置">
      <div
        class="flex"
        v-if="
          (deviceInfoDetail.product_type === 1 ||
            !deviceInfoDetail.product_type) &&
          deviceInfoDetail.portal_mode === 'PARALLEL'
        "
      >
        <div class="h-[20px] mr-[24px] mb-4 max-w-[600px]">
          <span class="text-T4 text-[14px] mr-2">{{
            baseParallelInfo[0].label
          }}</span>
          <span class="text-T2 text-[14px]">{{
            baseParallelInfo[0].value
          }}</span>
        </div>
      </div>
      <el-checkbox
        v-if="
          (deviceInfoDetail.product_type === 1 ||
            !deviceInfoDetail.product_type) &&
          deviceInfoDetail.portal_mode === 'PARALLEL'
        "
        v-model="isDomain"
        :disabled="true"
        label="域名方式"
        size="large"
      />
      <div
        v-if="
          (deviceInfoDetail.product_type === 1 ||
            !deviceInfoDetail.product_type) &&
          deviceInfoDetail.portal_mode === 'PARALLEL'
        "
        class="flex mt-4 flex-wrap"
      >
        <div
          v-for="item in baseParallelInfo.slice(1)"
          :key="item.name"
          class="h-[20px] mr-[24px] mb-4 w-[240px]"
        >
          <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
          <span class="text-T2 text-[14px]">{{ item.value }}</span>
        </div>
      </div>
      <div
        class="flex"
        v-if="
          (deviceInfoDetail.product_type === 1 ||
            !deviceInfoDetail.product_type) &&
          deviceInfoDetail.portal_mode === 'SERIAL'
        "
      >
        <div class="h-[20px] mr-[24px] mb-4">
          <span class="text-T4 text-[14px] mr-2">{{
            baseSerialInfo[0].label
          }}</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="baseSerialInfo[0].value"
            placement="top-start"
          >
            <span
              class="text-T2 text-[14px] inline-block max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap leading-[12px]"
              >{{ baseSerialInfo[0].value }}</span
            >
          </el-tooltip>
        </div>
      </div>
      <div
        v-if="
          (deviceInfoDetail.product_type === 1 ||
            !deviceInfoDetail.product_type) &&
          deviceInfoDetail.portal_mode === 'SERIAL'
        "
        class="flex mt-4 flex-wrap"
      >
        <div
          v-for="item in baseSerialInfo.slice(1)"
          :key="item.name"
          class="h-[20px] mr-[24px] mb-4 w-[240px]"
        >
          <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item.value"
            placement="top-start"
          >
            <span
              class="text-T2 text-[14px] inline-block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap leading-[12px]"
              >{{ item.value }}</span
            ></el-tooltip
          >
        </div>
      </div>
      <div class="flex flex-wrap" v-if="deviceInfoDetail.product_type === 2">
        <div class="w-full">
          <div class="h-[20px] mr-[24px] mb-6">
            <span class="text-T4 text-[14px] mr-2">{{
              baseGatewayInfo[0].label
            }}</span>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="baseGatewayInfo[0].value"
              placement="top-start"
            >
              <span
                class="text-T2 text-[14px] max-w-[600px] overflow-hidden text-ellipsis whitespace-nowrap"
                >{{ baseGatewayInfo[0].value }}</span
              ></el-tooltip
            >
          </div>
        </div>
        <div
          v-for="item in baseGatewayInfo.slice(1, 4)"
          :key="item.name"
          class="h-[20px] mr-[24px] mb-4 w-[240px]"
        >
          <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="item.value"
            placement="top-start"
          >
            <span
              class="text-T2 text-[14px] inline-block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap leading-[12px]"
              >{{ item.value }}</span
            ></el-tooltip
          >
        </div>
      </div>
      <div
        v-if="deviceInfoDetail.product_type === 2"
        class="font-medium text-T1 mb-4 important-h-[48px] leading-[72px] border-t-[1px] border-BG"
      >
        采集通道通信设置
      </div>
      <div
        class="flex"
        v-if="
          deviceInfoDetail.product_type === 2 &&
          deviceInfoDetail.port_type === 'COM'
        "
      >
        <div
          v-for="item in baseGatewayInfo.slice(4, 6)"
          :key="item.name"
          class="h-[20px] mr-[24px] mb-4 w-[240px]"
        >
          <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
          <span class="text-T2 text-[14px]">{{ item.value }}</span>
        </div>
      </div>
      <div
        class="flex"
        v-if="
          deviceInfoDetail.product_type === 2 &&
          deviceInfoDetail.port_type === 'ETHERNET'
        "
      >
        <div
          v-for="item in baseGatewayInfo.slice(6)"
          :key="item.name"
          class="h-[20px] mr-[24px] mb-4 w-[240px]"
        >
          <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
          <span class="text-T2 text-[14px]">{{ item.value }}</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane lazy label="高级配置" name="高级配置">
      <div class="border-b-[1px] border-BG">
        <div class="font-medium text-T1 mb-4 text-[16px]">时间设置</div>
        <div class="flex mt-4 flex-wrap">
          <div
            v-for="item in advancedInfo.slice(0, 5)"
            :key="item.name"
            class="h-[20px] mr-[24px] mb-4 w-[280px]"
          >
            <span class="text-T4 text-[14px] mr-2">{{ item.label }}</span>
            <span class="text-T2 text-[14px]">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="mt-6 border-b-[1px] border-BG">
        <div class="font-medium text-T1 mb-4 text-[16px]">数据读取设置</div>
        <div class="flex mt-4 flex-wrap dataConfiguration-checkbox">
          <el-checkbox
            :disabled="true"
            class="h-[20px] mr-[24px] mb-4 w-[200px]"
            v-for="item in advancedInfo.slice(5, 8)"
            :key="item.name"
            v-model="item.value"
            :label="item.label"
            size="large"
          />
        </div>
      </div>
      <div class="mt-6 border-b-[1px] border-BG">
        <div class="font-medium text-T1 mb-4 text-[16px]">调试信息设置</div>
        <div class="flex mt-4 flex-wrap dataConfiguration-checkbox">
          <el-checkbox
            :disabled="true"
            class="h-[20px] mr-[24px] mb-4 w-[200px]"
            v-for="item in advancedInfo.slice(8, 10)"
            :key="item.name"
            v-model="item.value"
            :label="item.label"
            size="large"
          />
        </div>
      </div>
      <div class="mt-6 border-b-[1px] border-BG">
        <div class="font-medium text-T1 mb-4 text-[16px]">其它</div>
        <div class="flex mt-4 flex-wrap dataConfiguration-checkbox">
          <el-checkbox
            :disabled="true"
            class="h-[20px] mr-[24px] mb-4 w-[200px]"
            v-for="item in advancedInfo.slice(10, 11)"
            :key="item.name"
            v-model="item.value"
            :label="item.label"
            size="large"
          />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane lazy label="扩展配置" name="扩展配置">
      <div class="font-medium text-T1 text-[16px] mb-4">设备自定义inf</div>
      <el-input
        :disabled="true"
        class="h-full"
        resize="none"
        v-model="textareaInf"
        type="textarea"
        placeholder="请输入设备自定义inf"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import type { CreateOrEditDeviceRuleFrom } from "../rules";
import { formatterValidValue } from "@/utils/index";

const deviceInfoDetail: any = inject("deviceInfoDetail");

const activeName = ref<string>("基础配置");
function handleClick() {}

const baseSerialInfoArr = [
  { name: "device_name", label: "设备名称：", value: "--" },
  { name: "comm_id", label: "通信ID：", value: "--" },
  { name: "portal_mode", label: "通道巡检方式", value: "--" },
];
const baseSerialInfo = ref(baseSerialInfoArr);

const baseParallelInfoArr = [
  { name: "device_name", label: "设备名称：", value: "--" },
  { name: "comm_id", label: "通信ID：", value: "--" },
  { name: "port_type", label: "通信方式：", value: "--" },
  { name: "addr", label: "主IP：", value: "--" },
  { name: "port", label: "端口号：", value: "--" },
];
const baseParallelInfo = ref(baseParallelInfoArr);

const baseGatewayInfoArr = [
  { name: "device_name", label: "设备名称：", value: "--" },
  //   { name: "device_type_name", label: "网关设备类型", value: "--" },
  { name: "gateway_name", label: "关联网关：", value: "--" },
  { name: "acquisition_channel_name", label: "采集通道：", value: "--" },
  { name: "forward_channel_name", label: "转发通道：", value: "--" },
  { name: "port_type", label: "通信方式：", value: "--" },
  { name: "comm_id", label: "通信地址：", value: "--" },
  { name: "port_type", label: "通信方式：", value: "--" },
  { name: "comm_id", label: "通信ID：", value: "--" },
  { name: "neta_ip", label: "A网IP：", value: "--" },
  { name: "netb_ip", label: "B网IP：", value: "--" },
  { name: "port", label: "端口号：", value: "--" },
];
const baseGatewayInfo = ref(baseGatewayInfoArr);
const isDomain = ref<boolean>(false);

const advancedInfoArr = [
  { name: "first_byte_wait_time", label: "头字节等待时间：", value: "--" },
  { name: "inter_byte_wait_time", label: "接收字节间隔时间：", value: "--" },
  { name: "send_delay", label: "发送前延时：", value: "--" },
  { name: "recv_delay", label: "接收前延时：", value: "--" },
  { name: "adjust_time_interval", label: "对时间隔：", value: "--" },
  { name: "read_eve_record", label: "读取事件数据", value: true },
  { name: "read_data_record", label: "读取定时记录", value: false },
  { name: "read_wav_record", label: "读取瞬时波形", value: false },
  { name: "write_console_info", label: "显示调试信息", value: true },
  { name: "write_debug_info", label: "保存调试信息", value: false },
  { name: "setp_meas_name", label: "报测点名", value: false },
];

const advancedInfo = ref(advancedInfoArr);

const textareaInf = ref<string>(
  "[VirtualDataLogCfgl\nTimeinterval=77\nParaHandle=0-1231000-101820-39143-162266-285.99\nTimeOffset=22 StatusParaHandle=-4\n[Main]\n[DataMap]\nWaveMapD=-2\nParaSetMaplD=-2\nDataRecMaplD=8677\n[NewSection]\ntestA=7"
);

watch(
  () => deviceInfoDetail.value,
  (val) => {
    nextTick(() => {
      emptyData();
      if (val?.device_id) {
        if (val.adv_param) {
          const singleChoiceKey = [
            "read_eve_record",
            "read_data_record",
            "read_wav_record",
            "write_console_info",
            "write_debug_info",
            "setp_meas_name",
          ];
          advancedInfo.value.forEach((item) => {
            if (singleChoiceKey.includes(item.name)) {
              item.value = val.adv_param[item.name] ? true : false;
            } else {
              item.value =
                val.adv_param[item.name] || val.adv_param[item.name] === 0
                  ? val.adv_param[item.name] + "ms"
                  : "--";
            }
          });
        }
        if (
          (val.product_type === 1 || !val.product_type) &&
          val.portal_mode === "SERIAL"
        ) {
          baseSerialInfo.value.forEach((item) => {
            if (item.name === "comm_id") {
              item.value = val.comm_config.comm_id;
            } else if (item.name === "portal_mode") {
              item.value = "串行";
            } else {
              item.value = formatterValidValue(val[item.name]) as string;
            }
          });
        } else if (
          (val.product_type === 1 || !val.product_type) &&
          val.portal_mode === "PARALLEL" &&
          val.port_type === "ETHERNET"
        ) {
          baseParallelInfo.value.forEach((item) => {
            if (
              item.name === "comm_id" ||
              item.name === "addr" ||
              item.name === "port"
            ) {
              item.value = val.comm_config[item.name];
              if (item.name === "addr") {
                const reg =
                  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if (reg.test(item.value)) {
                  isDomain.value = false;
                } else {
                  isDomain.value = true;
                }
              }
            } else if (item.name === "portal_mode") {
              item.value = "并行";
            } else if (item.name === "port_type") {
              item.value = "以太网";
            } else {
              item.value = formatterValidValue(val[item.name]) as string;
            }
          });
        } else if (val.product_type === 2) {
          baseGatewayInfo.value.forEach((item) => {
            if (
              item.name === "gateway_name" ||
              item.name === "acquisition_channel_name" ||
              item.name === "forward_channel_name"
            ) {
              item.value = val.comm_config[item.name]
                ? val.comm_config[item.name]
                : "--";
            } else if (
              item.name === "device_name" ||
              item.name === "device_type_name"
            ) {
              item.value = formatterValidValue(val[item.name]) as string;
            }
            if (val.port_type === "COM") {
              if (item.name === "port_type") {
                item.value = "串口";
              } else if (item.name === "comm_id") {
                item.value = val.comm_config.gateway_config.comm_id;
              }
            } else if (val.port_type === "ETHERNET") {
              if (item.name === "port_type") {
                item.value = "以太网";
              } else if (
                item.name === "comm_id" ||
                item.name === "neta_ip" ||
                item.name === "netb_ip" ||
                item.name === "port"
              ) {
                item.value = formatterValidValue(
                  val.comm_config?.gateway_config[item.name]
                ) as string;
              }
            }
          });
        }
        if (val.custom_inf) {
          textareaInf.value = val.custom_inf;
        }
      }
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

function emptyData() {
  baseSerialInfo.value = baseSerialInfoArr;
  baseParallelInfo.value = baseParallelInfoArr;
  baseGatewayInfo.value = baseGatewayInfoArr;
  advancedInfo.value = advancedInfoArr;
  textareaInf.value = "";
}
</script>
<style scoped lang="scss">
.dataConfiguration-checkbox {
  :deep(.is-checked .el-checkbox__label) {
    @include font_color("T3");
  }
}
</style>
