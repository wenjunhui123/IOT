<template>
  <div class="h-full w-full px-6 bg-BG1">
    <div class="w-full h-[55px] leading-[56px]">
      <div class="float-left cursor-pointer" @click="cancel">
        <DArrowLeft
          style="width: 20px; height: 20px; margin-right: 8px"
        ></DArrowLeft>
        <span class="text-T2 text-[18px] font-bold">{{ title }}</span>
      </div>
      <el-button
        class="float-right mt-3 mr-2"
        type="primary"
        @click="save(ruleFormRef)"
        >保存</el-button
      >
      <el-button class="float-right mt-3 mr-2" @click="cancel">取消</el-button>
    </div>
    <div class="h-[calc(100%-40px)] editForm">
      <el-form
        ref="ruleFormRef"
        class="h-full"
        label-position="top"
        :model="formData"
        :rules="EditFormwardChannelFormRules"
      >
        <div class="mb-6">
          <div class="pt-[16px] border-t border-BG">
            <div class="text-T2 text-[16px] font-bold mb-[16px]">基本信息</div>
            <el-row :gutter="24" class="mt-4 important-h-[72px]">
              <el-col :span="4" class="important-px-3">
                <el-form-item
                  class="important-h-[56px] is-required"
                  label="通道名称"
                  prop="channel_name"
                >
                  <el-input
                    v-model="formData.channel_name"
                    placeholder="请输入通道名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4" class="important-px-3">
                <el-form-item
                  class="important-h-[56px] is-required"
                  label="规约类型"
                  prop="protocol_id"
                >
                  <el-select
                    v-model="formData.protocol_id"
                    placeholder="请选择规约类型"
                    class="w-[328px]"
                    @change="changeProtocol"
                  >
                    <el-option
                      v-for="item in protocolOptions"
                      :key="item.protocol_id"
                      :label="item.protocol_desc"
                      :value="item.protocol_id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="4" class="important-px-3">
                <el-form-item
                  class="important-h-[56px] is-required"
                  label="端口号"
                  prop="port"
                >
                  <el-input-number
                    class="important-w-full important-pl-0"
                    v-model="formData.port"
                    :precision="0"
                    :controls="false"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px] is-required"
                  label="存储周期"
                  prop="storage_interval"
                >
                  <el-select
                    v-model="formData.storage_interval"
                    placeholder="请选择存储周期"
                    class="w-[328px]"
                  >
                    <el-option
                      v-for="item in storageOptions"
                      :key="item.interval"
                      :label="item.text"
                      :value="item.interval"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px] is-required"
                  label="关联厂站"
                  prop="station_id"
                >
                  <!-- <el-select
                    v-model="formData.station_id"
                    placeholder="请选择关联厂站"
                    class="w-[328px]"
                    :disabled="true"
                    @change="changeStation"
                  >
                    <el-option
                      v-for="item in stationOptions"
                      :key="item.nodeId"
                      :label="item.nodeName"
                      :value="item.nodeId"
                    />
                  </el-select> -->
                  <el-input
                    v-model="formData.station_name"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px]"
                  label="主站关联通道名称"
                  prop="custom_station_name"
                >
                  <el-input
                    v-model="formData.station_channel_name"
                    :disabled="true"
                  ></el-input>
                  <!-- :disabled="stationNameDisabled" -->
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="pt-[24px] border-t border-BG">
            <div class="text-T2 text-[16px] font-bold mb-[16px]">基本参数</div>
            <div v-if="isModbus">
              <el-row :gutter="24">
                <el-col :span="4" v-for="index of 5" :key="index">
                  <el-form-item
                    class="important-h-[56px] important-inline-block mr-24px w-full"
                    :label="`主站IP${index}`"
                    :prop="`peer_ip_${index}`"
                  >
                    <el-input
                      v-model="formData[`peer_ip_${index}`]"
                    ></el-input> </el-form-item
                ></el-col>
              </el-row>
            </div>
            <div v-if="!isModbus">
              <el-row :gutter="24">
                <el-col :span="4" v-for="(item, idx) in cloudBasic" :key="idx">
                  <el-form-item
                    class="important-h-[56px] important-inline-block mr-24px w-full"
                    :label="item.label"
                    :prop="item.prop"
                  >
                    <el-input-number
                      v-if="item.type === 'number'"
                      type="number"
                      :precision="0"
                      :controls="false"
                      class="important-w-full"
                      v-model="formData[item.prop]"
                    ></el-input-number>
                    <el-input v-model="formData[item.prop]" v-else></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="pt-[24px] border-t border-BG">
            <div class="text-T2 text-[16px] font-bold mb-[16px]">高级参数</div>
            <el-row :gutter="24">
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px]"
                  label="是否保留通信中"
                  prop="is_data_keep"
                >
                  <el-radio-group v-model="formData.is_data_keep">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="isModbus">
                <el-form-item
                  class="important-h-[56px]"
                  label="是否支持双活"
                  prop="is_double_alive"
                >
                  <el-radio-group v-model="formData.is_double_alive">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="!isModbus">
                <el-form-item
                  class="important-h-[56px]"
                  label="是否TSL加密"
                  prop="is_tls"
                >
                  <el-radio-group v-model="formData.is_tls">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px] numberUnit"
                  label="空闲断线时间"
                  prop="idle_time"
                >
                  <el-input-number
                    v-model="formData.idle_time"
                    :min="1"
                    :max="60"
                    :precision="0"
                    :controls="false"
                  >
                  </el-input-number>
                  <span class="unit">分</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="isModbus">
                <el-form-item
                  class="important-h-[56px] w-full"
                  label="通信ID"
                  prop="commu_id"
                >
                  <el-input-number
                    class="important-w-full"
                    :controls="false"
                    :min="1"
                    :max="255"
                    v-model="formData.commu_id"
                  ></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="4" v-if="isModbus">
                <el-form-item
                  class="important-h-[56px] w-full"
                  label="以太网采集口列表"
                  prop="eth_list"
                >
                  <el-input v-model="formData.eth_list"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  class="important-h-[56px] w-full numberUnit"
                  label="复位后数据上传"
                  prop="delay_time"
                >
                  <el-input-number
                    :min="0"
                    :max="60"
                    v-model="formData.delay_time"
                    :controls="false"
                  >
                  </el-input-number
                  ><span class="unit">分</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="20">
              <el-col :span="24">
                <el-form-item
                  class="important-h-[56px]"
                  label="备注"
                  prop="res"
                >
                  <el-input v-model="formData.res"></el-input>
                </el-form-item> </el-col
            ></el-row>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EditFormwardChannelFormRules } from "./rules";
import type { BasicConfigModel } from "./rules";
import {
  editForwardChannel,
  getProtocolList,
  getStationList,
  getStorageIntervalList,
  getForwardDetail,
} from "@/api/gatewayManage/index";
import { onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import type {
  StationResponse,
  ForwardDetailResponse,
} from "@/api/gatewayManage/types";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    currentNode: any;
    currentForwardInfo: any;
  }>(),
  {
    modelValue: false,
    currentNode: null,
    currentForwardInfo: null,
  }
);

const emit = defineEmits(["update:modelValue", "detailEvent", "success"]);

const title = ref<string>("编辑转发通道");

const ruleFormRef = ref<FormInstance>();
const formData = reactive<BasicConfigModel>({
  channel_name: "",
  protocol_id: undefined,
  protocol_desc: "",
  communication_mode: "",
  storage_interval: undefined,
  station_id: undefined,
  station_name: "",
  station_channel_name: "",
  channel_id: undefined,
  peer_ip_1: "",
  peer_ip_2: "",
  peer_ip_3: "",
  peer_ip_4: "",
  peer_ip_5: "",
  is_data_keep: false,
  idle_time: undefined,
  commu_id: undefined,
  is_double_alive: false,
  eth_list: "",
  delay_time: undefined,
  res: "",
  server: "",
  server_bk: "",
  port: undefined,
  port_server: undefined,
  port_bk: undefined,
  token: "",
  is_tls: false,
});
const protocolOptions = ref<any[]>([]);
const storageOptions = ref<any[]>([]);
const stationOptions = ref<any[]>([]);
const isModbus = ref<boolean>(true);
const initIsModbus = ref<boolean>(true);
const stationNameDisabled = ref<boolean>(true);
// 中电云协议
const cloudBasic = ref<any[]>([
  {
    label: "主站地址",
    prop: "server",
  },
  {
    label: "备站地址",
    prop: "server_bk",
  },
  {
    label: "主站端口",
    prop: "port_server",
    type: "number",
  },
  {
    label: "备站端口",
    prop: "port_bk",
    type: "number",
  },
  {
    label: "登录注册码",
    prop: "token",
  },
]);
const save = (ruleFormRef: FormInstance) => {
  let isCheck = checkIPAndPort();
  if (!ruleFormRef) return;
  if (!isCheck) return;
  let param = {
    channel_name: formData.channel_name,
    protocol_id: formData.protocol_id,
    port: formData.port,
    storage_interval: formData.storage_interval,
    station_id: formData.station_id,
    station_channel_id: formData.channel_id,
    station_channel_name: formData.station_channel_name,
    // modbus协议
    basic_para_list: isModbus.value
      ? {
          peer_ip_1: formData.peer_ip_1,
          peer_ip_2: formData.peer_ip_2,
          peer_ip_3: formData.peer_ip_3,
          peer_ip_4: formData.peer_ip_4,
          peer_ip_5: formData.peer_ip_5,
        }
      : {
          server: formData.server,
          port: formData.port_server,
          server_bk: formData.server_bk,
          port_bk: formData.port_bk,
          token: formData.token,
        },
    advance_para_list: isModbus.value
      ? {
          is_data_keep: formData.is_data_keep,
          idle_time: formData.idle_time,
          commu_id: formData.commu_id,
          is_double_alive: formData.is_double_alive,
          eth_list: formData.eth_list,
          delay_time: formData.delay_time,
          res: formData.res,
        }
      : {
          is_data_keep: formData.is_data_keep,
          is_tls: formData.is_tls,
          tls_file: "",
          idle_time: formData.idle_time,
          delay_time: formData.delay_time,
          res: formData.res,
        },
  };
  let gateway_id = props.currentNode.gateway_id;
  let channel_id = props.currentNode.channel_id;

  ruleFormRef.validate(async (valid: any) => {
    if (valid) {
      const res: UniversalReponse<null> = await editForwardChannel(
        param,
        gateway_id,
        channel_id
      );
      if (res.code === 0) {
        emit("success");
        emit("update:modelValue", false);
        ElMessage.success("编辑成功");
      }
    }
  });
};

const checkIPAndPort = () => {
  let result = true;
  if (formData.server && !formData.port_server) {
    result = false;
    ElMessageBox.confirm("请输入主站端口", "提示", {
      showCancelButton: false,
      confirmButtonText: "确定",
      type: "warning",
    }).then(() => {});
  }
  if (formData.server_bk && !formData.port_bk) {
    result = false;
    ElMessageBox.confirm("请输入备站端口", "提示", {
      showCancelButton: false,
      confirmButtonText: "确定",
      type: "warning",
    }).then(() => {});
  }
  return result;
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(async () => {
        await queryDetail();
        // await initFormData();
      });
    } else {
      clearData();
    }
  }
);
// 厂站id为0,不允许输入主站关联通道名称
function changeStation(val) {
  stationNameDisabled.value = val ? false : true;
}
function changeProtocol(val) {
  let obj = protocolOptions.value.find((item) => item.protocol_id === val);
  if (obj) {
    isModbus.value = obj.protocol_desc === "深圳中电ModbusTCP协议";
  }
  // modbus切换到中电云协议，端口默认为10000
  if (initIsModbus.value && isModbus.value) {
    formData.port_server = 10000;
    formData.port_bk = 10000;
  } else if (isModbus.value) {
    formData.is_double_alive = formData.is_double_alive
      ? formData.is_double_alive
      : false;
    formData.commu_id = formData.commu_id ? formData.commu_id : 255;
    formData.eth_list = formData.eth_list ? formData.eth_list : "P17;P18";
  } else {
    formData.is_tls = formData.is_tls ? formData.is_tls : false;
  }
}

function cancel() {
  ElMessageBox.confirm("确定要取消编辑吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      emit("detailEvent");
    })
    .catch(() => {
      ElMessage.info("操作已取消");
    });
}

async function getProtocolOptions() {
  const id = props.currentNode.gateway_id;
  const params = {
    channel_type: 2, // 转发通道
    communication_mode: formData.communication_mode,
  };
  const res = await getProtocolList(id, params);
  if (res.code === 0 && res.data?.length) {
    protocolOptions.value = res.data;
  }
}
async function getStationOptions() {
  const res: UniversalReponse<StationResponse[]> = await getStationList();
  if (res.code === 0 && res.data?.length) {
    stationOptions.value = res.data;
  } else {
    stationOptions.value = [];
  }
}
async function initList() {
  const res = await getStorageIntervalList(props.currentNode.gateway_id);
  if (res.code === 0 && res.data?.length) {
    storageOptions.value = res.data;
  }
  await getProtocolOptions();
  //   getStationOptions();
}
async function queryDetail() {
  let gateway_id = props.currentNode.gateway_id;
  let channel_id = props.currentNode.channel_id;
  const res: UniversalReponse<ForwardDetailResponse[]> = await getForwardDetail(
    gateway_id,
    channel_id
  );
  if (res.code === 0) {
    initFormData(res.data);
    await initList();
  }
}
function initFormData(data) {
  const port = data.port;
  // let data = props.currentForwardInfo;
  data = { ...data, ...data.basic_para_list, ...data.advance_para_list };
  data.port_server = data.basic_para_list.port;
  data.port = port;
  for (let key in formData) {
    formData[key] = data[key];
  }
  isModbus.value = formData.protocol_desc === "深圳中电ModbusTCP协议";
  initIsModbus.value = formData.protocol_desc === "深圳中电ModbusTCP协议";
  changeStation(formData.station_id);
}
function clearData() {
  for (let k in formData) {
    formData[k] = null;
  }
}
onMounted(() => {});
</script>
<style lang="scss">
.editForm {
  .numberUnit .el-input .el-input__wrapper {
    height: 32px !important;
    width: 100% !important;
    padding-left: 0px !important;
    border: 1px solid;
    @include border_color(B1);
    border-radius: 4px 0px 0px 4px !important;
    box-shadow: unset;
  }
  :deep(.el-input__inner) {
    height: 32px !important;
  }
}
</style>
<style scoped lang="scss">
.editForm {
  .numberUnit {
    :deep(.el-input-number) {
      height: 32px !important;
      width: calc(100% - 44px) !important;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    @include font_color("T1");
    padding: 0 !important;
    line-height: 20px !important;
  }

  :deep(.el-input-group__append) {
    box-shadow: none !important;
  }
  :deep(input::-webkit-inner-spin-button) {
    -webkit-appearance: none !important;
  }
  :deep(.el-input-number.is-without-controls .el-input__wrapper) {
    padding-left: 0px !important;
    width: 100% !important;
  }
}
.unit {
  width: 44px;
  height: 32px;
  box-sizing: border-box;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: var(--BG);
  text-align: center;
  border-color: var(--B1);
  border-right-width: 1px;
  border-top-width: 1px;
  border-bottom-width: 1px;
}
</style>
