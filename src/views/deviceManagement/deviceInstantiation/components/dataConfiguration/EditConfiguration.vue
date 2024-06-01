<template>
  <el-tabs
    v-model="activeName"
    class="h-full createOrEditForm"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane label="基础配置" name="基础配置">
      <el-form
        ref="ruleFormRef"
        class="h-full"
        label-position="top"
        :model="basicConfigModel"
        :rules="EditConfigurationRuleFromRules"
      >
        <div class="flex w-full important-h-[72px]">
          <el-form-item
            class="important-h-[56px] important-w-[464px] mr-6"
            label="设备名称"
            prop="device_name"
          >
            <el-input
              v-model="basicConfigModel.device_name"
              placeholder="请输入设备名称"
            />
          </el-form-item>
          <el-form-item
            v-if="injectDeviceInfoDetail.product_type === 2"
            class="important-h-[64px] mr-6"
            label="关联网关"
            prop="gateway_id"
          >
            <!-- <el-select
              class="w-full"
              v-model="basicConfigModel.gateway_id"
              placeholder="请选择"
              :disabled="true"
            >
              <el-option
                v-for="item in associated_gateway_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-input
              :disabled="true"
              v-model="basicConfigModel.gateway_name"
              placeholder="请输入管理网关"
            />
          </el-form-item>
          <el-form-item
            v-if="injectDeviceInfoDetail.product_type === 2"
            class="important-h-[64px] mr-6"
            label="采集通道"
            prop="acquisition_channel_id"
          >
            <el-select
              class="w-full"
              v-model="basicConfigModel.acquisition_channel_id"
              placeholder="请选择"
            >
              <el-option
                v-for="item in acquisition_channel_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="injectDeviceInfoDetail.product_type === 2"
            class="important-h-[64px] mr-6"
            label="转发通道"
            prop="forward_channel_id"
          >
            <!-- <el-select
              class="w-full"
              v-model="basicConfigModel.forward_channel_id"
              placeholder="请选择"
              :disabled="true"
            >
              <el-option
                v-for="item in forwarding_channel_options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-input
              :disabled="true"
              v-model="basicConfigModel.forward_channel_name"
              placeholder="请输入转发通道"
            />
          </el-form-item>
        </div>
        <div
          v-if="
            injectDeviceInfoDetail.product_type === 1 ||
            !injectDeviceInfoDetail.product_type
          "
          class="flex mt-6 w-full important-h-[56px]"
        >
          <el-form-item
            class="important-w-[220px] mr-6"
            label="通信ID"
            prop="comm_id"
          >
            <el-input-number
              class="important-w-full"
              :controls="false"
              v-model="basicConfigModel.comm_id"
              placeholder="请输入通信ID"
            />
          </el-form-item>
          <el-form-item
            class="important-h-[56px] important-w-[220px]"
            label="通道巡检方式"
            prop="portal_mode"
            v-if="
              (injectDeviceInfoDetail.product_type === 1 ||
                !injectDeviceInfoDetail.product_type) &&
              injectDeviceInfoDetail.portal_mode === 'SERIAL'
            "
          >
            <el-select
              v-model="basicConfigModel.portal_mode"
              placeholder="请选择巡检方式"
              class="w-[328px]"
              :disabled="true"
              @change="changePortalMode"
            >
              <el-option
                v-for="item in portalModeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="important-w-[220px] mr-6"
            label="通信方式"
            prop="port_type"
            v-if="
              (injectDeviceInfoDetail.product_type === 1 ||
                !injectDeviceInfoDetail.product_type) &&
              injectDeviceInfoDetail.portal_mode === 'PARALLEL'
            "
          >
            <el-select
              class="w-full"
              v-model="basicConfigModel.port_type"
              placeholder="请选择通信方式"
              :disabled="true"
            >
              <el-option
                v-for="item in portTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="important-w-[220px] mr-6 is-required isDomainAddr"
            label=""
            prop="addr"
            v-if="
              (injectDeviceInfoDetail.product_type === 1 ||
                !injectDeviceInfoDetail.product_type) &&
              injectDeviceInfoDetail.portal_mode === 'PARALLEL'
            "
          >
            <div
              class="float-right flex w-[calc(100%-20px)] h-[20px] mb-2 justify-between"
              slot="label"
            >
              <div class="important-h-[20px] leading-[20px]">主IP</div>
              <el-checkbox
                v-model="isDomain"
                class="important-h-[20px] leading-[20px]"
                label="域名方式"
                size="large"
                @change="changeDomainType"
              />
            </div>
            <el-input
              v-model="basicConfigModel.addr"
              placeholder="请输入主IP"
            />
          </el-form-item>
          <el-form-item
            class="important-w-[220px] mr-6"
            label="端口号"
            prop="port"
            v-if="
              (injectDeviceInfoDetail.product_type === 1 ||
                !injectDeviceInfoDetail.product_type) &&
              injectDeviceInfoDetail.portal_mode === 'PARALLEL'
            "
          >
            <el-input-number
              class="important-w-full"
              :controls="false"
              v-model="basicConfigModel.port"
              placeholder="请输入端口号"
            />
          </el-form-item>
        </div>
        <div
          v-if="injectDeviceInfoDetail.product_type === 2"
          class="font-medium text-T1 important-h-[48px] leading-[72px] border-t-[1px] border-BG"
        >
          采集通道通信设置
        </div>
        <div
          v-if="injectDeviceInfoDetail.product_type === 2"
          class="flex mt-6 w-full important-h-[56px]"
        >
          <el-form-item
            class="important-w-[220px] mr-6"
            label="通信方式"
            prop="port_type"
          >
            <el-select
              class="w-full"
              v-model="basicConfigModel.port_type"
              placeholder="请选择通信方式"
              :disabled="true"
            >
              <el-option
                v-for="item in portTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="important-h-[64px] mr-6"
            :label="
              injectDeviceInfoDetail.port_type === 'COM' ? '通信地址' : '通信ID'
            "
            prop="comm_id"
          >
            <el-input
              v-model="basicConfigModel.comm_id"
              placeholder="请输入通信"
            />
          </el-form-item>
          <el-form-item
            v-if="injectDeviceInfoDetail.port_type === 'ETHERNET'"
            class="important-h-[56px] mr-6"
            label="A网IP"
            prop="neta_ip"
          >
            <el-input
              v-model="basicConfigModel.neta_ip"
              placeholder="请输入A网IP"
            />
          </el-form-item>
          <el-form-item
            v-if="injectDeviceInfoDetail.port_type === 'ETHERNET'"
            class="important-h-[56px] mr-6"
            label="B网IP"
            prop="netb_ip"
          >
            <el-input
              v-model="basicConfigModel.netb_ip"
              placeholder="请输入B网IP"
            />
          </el-form-item>
          <el-form-item
            class="important-h-[56px] mr-6"
            v-if="injectDeviceInfoDetail.port_type === 'ETHERNET'"
            label="端口号"
            prop="port"
          >
            <el-input-number
              class="important-w-full"
              :controls="false"
              v-model="basicConfigModel.port"
              placeholder="请输入端口号"
            />
          </el-form-item></div
      ></el-form>
    </el-tab-pane>
    <el-tab-pane label="高级配置" name="高级配置">
      <el-form
        ref="advanceFormRef"
        class="h-full"
        label-position="top"
        :model="advanceConfigModel"
        :rules="EditAdvanceRuleFromRules"
      >
        <div class="font-medium text-T1 mb-4">时间设置</div>
        <div
          class="mt-4 important-h-[72px] border-b-[1px] border-BG advanced flex"
        >
          <el-form-item
            class="important-h-[56px] mr-6"
            label="头字节等待时间"
            prop="first_byte_wait_time"
          >
            <div class="flex">
              <el-input-number
                :min="0"
                class="important-w-[220px] important-max-w-[220px] important-flex-auto"
                :controls="false"
                v-model="advanceConfigModel.first_byte_wait_time"
                placeholder="请输入头字节等待时间"
              >
              </el-input-number>
              <span
                class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] rounded-[4px] border-y-1 border-r-1 border-B1 bg-BG"
                >ms</span
              >
            </div>
          </el-form-item>
          <el-form-item
            class="important-h-[56px] mr-6"
            label="接收字节间隔时间"
            prop="inter_byte_wait_time"
          >
            <div class="flex">
              <el-input-number
                :min="0"
                class="important-w-[220px] important-max-w-[220px] important-flex-auto"
                :controls="false"
                v-model="advanceConfigModel.inter_byte_wait_time"
                placeholder="请输入接收字节间隔时间"
              >
              </el-input-number>
              <span
                class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] rounded-[4px] border-y-1 border-r-1 border-B1 bg-BG"
                >ms</span
              >
            </div>
          </el-form-item>
          <el-form-item
            class="important-h-[56px] mr-6"
            label="发送前延时"
            prop="send_delay"
          >
            <div class="flex">
              <el-input-number
                :min="0"
                class="important-w-[220px] important-max-w-[220px] important-flex-auto"
                :controls="false"
                v-model="advanceConfigModel.send_delay"
                placeholder="请输入发送前延时"
              >
              </el-input-number>
              <span
                class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] rounded-[4px] border-y-1 border-r-1 border-B1 bg-BG"
                >ms</span
              >
            </div>
          </el-form-item>
          <el-form-item
            class="important-h-[56px] mr-6"
            label="接收前延时"
            prop="recv_delay"
          >
            <div class="flex">
              <el-input-number
                :min="0"
                class="important-w-[220px] important-max-w-[220px] important-flex-auto"
                :controls="false"
                v-model="advanceConfigModel.recv_delay"
                placeholder="请输入接收前延时"
              >
              </el-input-number>
              <span
                class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] rounded-[4px] border-y-1 border-r-1 border-B1 bg-BG"
                >ms</span
              >
            </div>
          </el-form-item>
          <el-form-item
            class="important-h-[56px] mr-6"
            label="对时间隔"
            prop="adjust_time_interval"
          >
            <div class="flex">
              <el-input-number
                :min="0"
                class="important-w-[220px] important-max-w-[220px] important-flex-auto"
                :controls="false"
                v-model="advanceConfigModel.adjust_time_interval"
                placeholder="请输入对时间隔"
              >
              </el-input-number>
              <span
                class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] rounded-[4px] border-y-1 border-r-1 border-B1 bg-BG"
                >ms</span
              >
            </div>
          </el-form-item>
        </div>
        <div class="font-medium text-T1 mt-6 mb-4">数据读取设置</div>
        <div
          class="flex mt-4 border-b-[1px] border-BG flex-wrap dataConfiguration-checkbox"
        >
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.read_eve_record"
            label="读取事件数据"
          />
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.read_data_record"
            label="读取定时记录"
          />
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.read_wav_record"
            label="读取瞬时波形"
          />
        </div>
        <div class="font-medium text-T1 mt-6 mb-4">调试信息设置</div>
        <div
          class="flex mt-4 border-b-[1px] border-BG flex-wrap dataConfiguration-checkbox"
        >
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.write_console_info"
            label="显示调试信息"
          />
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.write_debug_info"
            label="保存调试信息"
          />
        </div>
        <div class="font-medium text-T1 mt-6 mb-4">其它</div>
        <div class="flex mt-4 flex-wrap dataConfiguration-checkbox">
          <el-checkbox
            class="important-h-[22px] mr-[24px] mb-4 w-[200px]"
            v-model="advanceConfigModel.setp_meas_name"
            label="报测点名"
          />
        </div>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="扩展配置" name="扩展配置">
      <div class="font-medium text-T1 text-[16px] mb-4">设备自定义inf</div>
      <el-input
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
import type { FormInstance } from "element-plus";
import { getAllDevicetypes } from "@/api/channelManagement/index";
import type { Drvtypes } from "@/api/channelManagement/type";
import {
  type EditConfigurationRuleFrom,
  EditConfigurationRuleFromRules,
  EditAdvanceRuleFromRules,
} from "./rules";

import {
  editDevices,
  getProductDataInfo,
} from "@/api/deviceInstantiation/index";
import type {
  EditDeviceDataQuerty,
  DeviceDataInfoResponse,
} from "@/api/deviceInstantiation/types";
import type {
  GatewayMainResponse,
  GatewayAcquisitionResponse,
  GatewayForwardResponse,
} from "@/api/gatewayManage/types";
import {
  getGatewayMainData,
  getGatewayAcquisitionData,
  getGatewayForwardData,
} from "@/api/gatewayManage/index";

/*
事件定义
*/
const emit = defineEmits(["ok"]);

const injectDeviceInfoDetail: any = inject("deviceInfoDetail");

const newDeviceInfoDetail = ref<any>();
const activeName = ref<string>("基础配置");
function handleClick() {}

const basicConfigModelObj = {
  device_id: undefined,
  device_name: "",
  comm_id: undefined,
  port_type: "",
  addr: "",
  port: undefined,
  portal_mode: "",
  device_type_name: "",
  gateway_id: undefined,
  gateway_name: "",
  acquisition_channel_id: undefined,
  forward_channel_id: undefined,
  forward_channel_name: "",
  neta_ip: undefined,
  netb_ip: undefined,
};
const basicConfigModel = ref<EditConfigurationRuleFrom>(basicConfigModelObj);

const advanceConfigModelObj = {
  first_byte_wait_time: 1000,
  inter_byte_wait_time: 500,
  send_delay: 0,
  recv_delay: 0,
  adjust_time_interval: 0,
  read_eve_record: true,
  read_data_record: false,
  read_wav_record: false,
  write_console_info: true,
  write_debug_info: false,
  setp_meas_name: true,
};
const advanceConfigModel = ref(advanceConfigModelObj);

const isDomain = ref<boolean>(false);
function changeDomainType() {
  if (isDomain.value) {
    EditConfigurationRuleFromRules.addr = [
      {
        required: true,
        message: "请输入主IP",
        trigger: ["blur", "change"],
      },
      {
        pattern:
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, // https://regexr.com
        message: "请输入正确的域名",
        trigger: ["blur", "change"],
      },
    ];
  } else {
    EditConfigurationRuleFromRules.addr = [
      {
        required: true,
        message: "请输入主IP",
        trigger: ["blur", "change"],
      },
      {
        pattern:
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        message: "请输入正确的ip地址",
        trigger: ["blur", "change"],
      },
    ];
  }
}

const portTypeOptions = ref([
  {
    value: "COM",
    label: "串口",
  },
  {
    value: "ETHERNET",
    label: "以太网",
  },
]);
const gatewayDevice_type_options = ref<{ id: number; name: string }[]>([]);
async function getAllTypesDate() {
  gatewayDevice_type_options.value = [];
  const resDevice: UniversalReponse<Drvtypes[]> = await getAllDevicetypes();
  if (resDevice.code === 0 && resDevice.data?.length) {
    resDevice.data.forEach((item) => {
      const param = {
        id: item.nodeId,
        name: item.nodeName,
      };
      gatewayDevice_type_options.value.push(param);
    });
  }
}
const associated_gateway_options = ref<
  {
    id: number;
    name: string;
  }[]
>([]);
const acquisition_channel_options = ref<
  { id: number; name: string; port_type: string }[]
>([]);
const forwarding_channel_options = ref<
  { id: number; name: string; channel_id: number; channel_name: string }[]
>([]);

const portalModeOptions = ref([
  {
    value: "SERIAL",
    label: "串行",
  },
  {
    value: "PARALLEL",
    label: "并行",
  },
]);
function changePortalMode(value: string) {
  //   if (value === "PARALLEL") {
  //   } else {
  //   }
}

const textareaInf = ref<string>(
  "[VirtualDataLogCfgl\nTimeinterval=77\nParaHandle=0-1231000-101820-39143-162266-285.99\nTimeOffset=22 StatusParaHandle=-4\n[Main]\n[DataMap]\nWaveMapD=-2\nParaSetMaplD=-2\nDataRecMaplD=8677\n[NewSection]\ntestA=7"
);

watch(
  () => injectDeviceInfoDetail.value,
  (val) => {
    nextTick(async () => {
      if (val?.device_id) {
        await emptyData();
        await queryProductDataInfo(val?.device_id as number);
        if (newDeviceInfoDetail.value?.device_id) {
          if (newDeviceInfoDetail.value.adv_param) {
            const singleChoiceKey = [
              "read_eve_record",
              "read_data_record",
              "read_wav_record",
              "write_console_info",
              "write_debug_info",
              "setp_meas_name",
            ];
            for (let key in advanceConfigModel.value) {
              if (singleChoiceKey.includes(key)) {
                advanceConfigModel.value[key] = newDeviceInfoDetail.value
                  .adv_param[key]
                  ? true
                  : false;
              } else {
                advanceConfigModel.value[key] =
                  newDeviceInfoDetail.value.adv_param[key];
              }
            }
          }
          let baseInfoKey = ["device_name", "comm_id", "portal_mode"];
          if (
            (newDeviceInfoDetail.value.product_type === 1 ||
              !newDeviceInfoDetail.value.product_type) &&
            newDeviceInfoDetail.value.portal_mode === "SERIAL"
          ) {
            baseInfoKey.forEach((key) => {
              if (key === "comm_id") {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config.comm_id;
              } else {
                basicConfigModel.value[key] = newDeviceInfoDetail.value[key];
              }
            });
          } else if (
            (newDeviceInfoDetail.value.product_type === 1 ||
              !newDeviceInfoDetail.value.product_type) &&
            newDeviceInfoDetail.value.portal_mode === "PARALLEL" &&
            newDeviceInfoDetail.value.port_type === "ETHERNET"
          ) {
            baseInfoKey = [
              "device_name",
              "comm_id",
              "port_type",
              "addr",
              "port",
            ];
            baseInfoKey.forEach((key) => {
              if (key === "comm_id" || key === "addr" || key === "port") {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config[key];
                if (key === "addr") {
                  const reg =
                    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                  if (reg.test(newDeviceInfoDetail.value.comm_config[key])) {
                    isDomain.value = false;
                  } else {
                    isDomain.value = true;
                  }
                }
              } else {
                basicConfigModel.value[key] = newDeviceInfoDetail.value[key];
              }
            });
          } else if (
            newDeviceInfoDetail.value.product_type === 2 &&
            newDeviceInfoDetail.value.port_type === "COM"
          ) {
            baseInfoKey = [
              "device_name",
              "port_type",
              "comm_id",
              "device_type_name",
              "gateway_id",
              "gateway_name",
              "acquisition_channel_id",
              "forward_channel_id",
              "forward_channel_name",
            ];
            baseInfoKey.forEach((key) => {
              if (
                key === "gateway_id" ||
                key === "gateway_name" ||
                key === "acquisition_channel_id" ||
                key === "forward_channel_id" ||
                key === "forward_channel_name"
              ) {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config[key];
              } else if (key === "comm_id") {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config?.gateway_config[key];
              } else {
                basicConfigModel.value[key] = newDeviceInfoDetail.value[key];
              }
            });
          } else if (
            newDeviceInfoDetail.value.product_type === 2 &&
            newDeviceInfoDetail.value.port_type === "ETHERNET"
          ) {
            baseInfoKey = [
              "device_name",
              "port_type",
              "comm_id",
              "neta_ip",
              "netb_ip",
              "port",
              "device_type_name",
              "gateway_id",
              "gateway_name",
              "acquisition_channel_id",
              "forward_channel_id",
              "forward_channel_name",
            ];
            baseInfoKey.forEach((key) => {
              if (
                key === "gateway_id" ||
                key === "gateway_name" ||
                key === "acquisition_channel_id" ||
                key === "forward_channel_id" ||
                key === "forward_channel_name"
              ) {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config[key];
              } else if (
                key === "comm_id" ||
                key === "neta_ip" ||
                key === "netb_ip" ||
                key === "port"
              ) {
                basicConfigModel.value[key] =
                  newDeviceInfoDetail.value.comm_config?.gateway_config[key] ===
                  null
                    ? undefined
                    : newDeviceInfoDetail.value.comm_config?.gateway_config[
                        key
                      ];
              } else {
                basicConfigModel.value[key] = newDeviceInfoDetail.value[key];
              }
            });
          }
          if (newDeviceInfoDetail.value.custom_inf) {
            textareaInf.value = newDeviceInfoDetail.value.custom_inf;
          } else {
            textareaInf.value = "";
          }
        }
      }
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

const ruleFormRef = ref<FormInstance>();
const advanceFormRef = ref<FormInstance>();

async function emptyData() {
  basicConfigModel.value = basicConfigModelObj;
  advanceConfigModel.value = advanceConfigModelObj;
  textareaInf.value = "";
  if (injectDeviceInfoDetail.value.product_type === 2) {
    const param = {
      page_size: 1000,
      page: 1,
    };
    // const resGatewayMainData: UniversalReponse<GatewayMainResponse[]> =
    //   await getGatewayMainData(param);
    // if (resGatewayMainData.code === 0 && resGatewayMainData.data.length) {
    //   associated_gateway_options.value = resGatewayMainData.data.map((item) => {
    //     return {
    //       id: item.gateway_id,
    //       name: item.gateway_name,
    //     };
    //   });
    // }
    const resGatewayAcquisitionData: UniversalReponse<
      GatewayAcquisitionResponse[]
    > = await getGatewayAcquisitionData(
      injectDeviceInfoDetail.value.comm_config.gateway_id as number
    );
    if (
      resGatewayAcquisitionData.code === 0 &&
      resGatewayAcquisitionData.data?.length
    ) {
      acquisition_channel_options.value = resGatewayAcquisitionData.data
        .map((item) => {
          return {
            id: item.channel_id,
            name: item.channel_name,
            port_type:
              item.communication_mode === 1
                ? "ETHERNET"
                : item.communication_mode === 2
                ? "COM"
                : "WIRELESS",
          };
        })
        .filter((item) => {
          return item.port_type === injectDeviceInfoDetail.value.port_type;
        });
    } else {
      acquisition_channel_options.value = [];
    }
    // const resGatewayForwardData: UniversalReponse<GatewayForwardResponse[]> =
    //   await getGatewayForwardData(
    //     injectDeviceInfoDetail.value.comm_config.gateway_id as number
    //   );
    // if (
    //   resGatewayForwardData.code === 0 &&
    //   resGatewayForwardData.data?.length
    // ) {
    //   forwarding_channel_options.value = resGatewayForwardData.data.map(
    //     (item) => {
    //       return {
    //         id: item.channel_id,
    //         name: item.channel_name,
    //         channel_id: item.station_channel_id,
    //         channel_name: item.station_channel_name,
    //       };
    //     }
    //   );
    // } else {
    //   forwarding_channel_options.value = [];
    // }
  }
}

/* 表单上传模块 */
async function confirm(
  formEl1: FormInstance | undefined,
  formEl2: FormInstance | undefined
) {
  if (!formEl1) return;
  const valid1 = await formEl1.validate().catch((err) => {
    return err;
  });
  if (!formEl2) return;
  const valid2 = await formEl2.validate().catch((err) => {
    return err;
  });
  if (valid1 !== true) {
    activeName.value = "基础配置";
  } else if (valid2 !== true) {
    activeName.value = "高级配置";
  }
  if (valid1 === true && valid2 === true) {
    let param: EditDeviceDataQuerty = {
      device_id: 0,
      device_name: "",
      comm_config: {},
      custom_inf: "",
    };
    const singleChoiceKey = [
      "read_eve_record",
      "read_data_record",
      "read_wav_record",
      "write_console_info",
      "write_debug_info",
      "setp_meas_name",
    ];
    const adv_param = advanceConfigModel.value;
    singleChoiceKey.forEach((key) => {
      adv_param[key] = adv_param[key] ? 1 : 0;
    });
    if (
      (newDeviceInfoDetail.value.product_type === 1 ||
        !newDeviceInfoDetail.value.product_type) &&
      newDeviceInfoDetail.value.portal_mode === "SERIAL"
    ) {
      param = {
        device_id: newDeviceInfoDetail.value.device_id,
        device_name: basicConfigModel.value.device_name as string,
        //   port_type: newDeviceInfoDetail.value.port_type,
        comm_config: {
          comm_id: Number(basicConfigModel.value.comm_id),
        },
        adv_param: adv_param,
        custom_inf: textareaInf.value,
      };
    } else if (
      (newDeviceInfoDetail.value.product_type === 1 ||
        !newDeviceInfoDetail.value.product_type) &&
      newDeviceInfoDetail.value.portal_mode === "PARALLEL" &&
      newDeviceInfoDetail.value.port_type === "ETHERNET"
    ) {
      param = {
        device_id: newDeviceInfoDetail.value.device_id,
        device_name: basicConfigModel.value.device_name as string,
        port_type: newDeviceInfoDetail.value.port_type,
        comm_config: {
          comm_id: Number(basicConfigModel.value.comm_id),
          addr: basicConfigModel.value.addr,
          port: basicConfigModel.value.port,
        },
        adv_param: adv_param,
        custom_inf: textareaInf.value,
      };
    } else if (
      newDeviceInfoDetail.value.product_type === 2 &&
      newDeviceInfoDetail.value.port_type === "COM"
    ) {
      param = {
        device_id: newDeviceInfoDetail.value.device_id,
        device_name: basicConfigModel.value.device_name as string,
        // port_type: newDeviceInfoDetail.value.port_type,
        comm_config: {
          acquisition_channel_id: basicConfigModel.value.acquisition_channel_id,
          //   forward_channel_id: basicConfigModel.value.forward_channel_id,
          // gateway_id: basicConfigModel.value.gateway_id,
          gateway_config: {
            comm_id: Number(basicConfigModel.value.comm_id),
          },
        },
        adv_param: adv_param,
        custom_inf: textareaInf.value,
      };
    } else if (
      newDeviceInfoDetail.value.product_type === 2 &&
      newDeviceInfoDetail.value.port_type === "ETHERNET"
    ) {
      param = {
        device_id: newDeviceInfoDetail.value.device_id,
        device_name: basicConfigModel.value.device_name as string,
        // port_type: newDeviceInfoDetail.value.port_type,
        comm_config: {
          acquisition_channel_id: basicConfigModel.value.acquisition_channel_id,
          //   forward_channel_id: basicConfigModel.value.forward_channel_id,
          // gateway_id: basicConfigModel.value.gateway_id,
          gateway_config: {
            comm_id: Number(basicConfigModel.value.comm_id),
            neta_ip: basicConfigModel.value.neta_ip,
            netb_ip: basicConfigModel.value.netb_ip,
            port: basicConfigModel.value.port,
          },
        },
        adv_param: adv_param,
        custom_inf: textareaInf.value,
      };
    }
    const res = await editDevices(param);
    if (res.code === 0) {
      ElMessage.success("编辑设备成功！");
      emit("ok", "edit");
    }
  }
}

async function queryProductDataInfo(deviceId: number) {
  const res: UniversalReponse<DeviceDataInfoResponse> =
    await getProductDataInfo({ device_id: deviceId });
  if (res.code === 0 && res.data) {
    newDeviceInfoDetail.value = res.data;
  }
}

defineExpose({ confirm, ruleFormRef, advanceFormRef });
</script>

<style scoped lang="scss">
.createOrEditForm {
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    @include font_color("T1");
    padding: 0 !important;
    line-height: 20px !important;
  }
  :deep(.el-input__wrapper) {
    width: 220px !important;
    height: 32px !important;
    padding: 0px 12px !important;
  }
  :deep(.el-input__inner) {
    height: 32px !important;
  }
  .advanced {
    :deep(.el-input__wrapper) {
      width: 236px !important;
      border: 1px solid;
      border-right: 0 !important;
      @include border_color(B1);
      border-radius: 4px 0px 0px 4px;
      box-shadow: unset;
    }
  }
  .isDomainAddr {
    :deep(.el-form-item__content::before) {
      content: "*";
      display: inline-block;
      height: 20px;
      line-height: 20px;
      margin-bottom: 8px;
      color: var(--el-color-danger);
      margin-right: 4px;
    }
  }
}
</style>
