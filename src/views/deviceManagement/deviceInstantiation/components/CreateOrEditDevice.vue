<template>
  <el-dialog
    class="deviceInstantiation-createOrEditDevicePage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditDeviceForm"
      label-position="top"
      :model="model"
      :rules="CreateOrEditDeviceRuleFromRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="设备名称"
              prop="device_name"
            >
              <el-input
                v-model="model.device_name"
                placeholder="请输入设备名称"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="产品类型"
              prop="product_type"
            >
              <el-select
                class="w-full"
                v-model="model.product_type"
                placeholder="请选择"
                :disabled="true"
              >
                <el-option
                  v-for="item in product_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label="关联通道"
              prop="channel_id"
            >
              <el-select
                class="w-full"
                v-model="model.channel_id"
                placeholder="请选择"
                :disabled="true"
                @change="changechannel_id"
              >
                <el-option
                  v-for="item in associated_channel_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label="网关设备类型"
              prop="gatewayDeviceType"
            >
              <el-select
                class="w-full"
                v-model="model.gatewayDeviceType"
                :disabled="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gatewayDevice_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label="采集通道"
              prop="acquisition_channel_id"
            >
              <el-select
                class="w-full"
                v-model="model.acquisition_channel_id"
                placeholder="请选择"
                @change="change_acquisition_channel_id"
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
              class="important-h-[56px]"
              label="通道巡检方式"
              prop="portal_mode"
              v-if="model.product_type === 1"
            >
              <el-select
                v-model="model.portal_mode"
                :disabled="true"
                placeholder="请选择巡检方式"
                class="w-[328px]"
                @change="changeportal_mode"
              >
                <el-option
                  v-for="item in portal_modeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="通信ID"
              prop="comm_id"
              v-if="
                (model.product_type === 1 &&
                  model.portal_mode === 'PARALLEL') ||
                (model.product_type === 2 && model.port_type === 'ETHERNET')
              "
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.comm_id"
                placeholder="请输入通信ID"
              />
            </el-form-item>
            <el-checkbox
              v-if="
                model.product_type === 1 && model.portal_mode === 'PARALLEL'
              "
              v-model="isDomain"
              label="域名方式"
              size="large"
              @change="changeDomainType"
            />
            <el-form-item
              v-if="
                model.product_type === 1 && model.portal_mode === 'PARALLEL'
              "
              class="important-h-[56px]"
              label="主IP"
              prop="addr"
            >
              <el-input v-model="model.addr" placeholder="请输入主IP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="产品名称"
              prop="product_id"
            >
              <el-select
                class="w-full"
                v-model="model.product_id"
                placeholder="请选择"
                @change="changeProduct"
              >
                <el-option
                  v-for="item in product_name_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="model.product_type === 1"
              class="important-h-[64px]"
              label="关联通道"
              prop="channel_id"
            >
              <el-select
                class="w-full"
                v-model="model.channel_id"
                placeholder="请选择"
                :disabled="props.currentNode.modelLabel === 'channel'"
                @change="changechannel_id"
              >
                <el-option
                  v-for="item in associated_channel_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label=""
              prop=""
            ></el-form-item>
            <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label="关联网关"
              prop="gateway_id"
            >
              <el-select
                class="w-full"
                v-model="model.gateway_id"
                placeholder="请选择"
                :disabled="props.currentNode.modelLabel === 'channel'"
                @change="changegateway_id"
              >
                <el-option
                  v-for="item in associated_gateway_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="model.product_type === 2"
              class="important-h-[64px]"
              label="转发通道"
              prop="forward_channel_id"
            >
              <el-select
                class="w-full"
                v-model="model.forward_channel_id"
                :disabled="props.currentNode.modelLabel === 'channel'"
                placeholder="请选择"
                @change="changeForwardChannel"
              >
                <el-option
                  v-for="item in forwarding_channel_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="important-h-[56px]"
              label="通信方式"
              prop="port_type"
              v-if="
                model.product_type === 1 && model.portal_mode === 'PARALLEL'
              "
            >
              <el-select
                class="w-full"
                v-model="model.port_type"
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
              class="important-h-[64px]"
              label="通信ID"
              prop="comm_id"
              v-if="model.product_type === 1 && model.portal_mode === 'SERIAL'"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.comm_id"
                placeholder="请输入通信ID"
              />
            </el-form-item>
            <div
              v-if="
                model.product_type === 1 && model.portal_mode === 'PARALLEL'
              "
              class="h-120px"
            ></div>
            <el-form-item
              class="important-h-[56px]"
              v-if="
                model.product_type === 1 && model.portal_mode === 'PARALLEL'
              "
              label="端口号"
              prop="port"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.port"
                placeholder="请输入端口号"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div
        class="px-6 py-4 bg-BG1 rounded-lg mb-[10px] mt-10px"
        v-if="model.product_type === 2"
      >
        <div class="font-bold text-T1 mb-24px">采集通道通信设置</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[56px]"
              label="通信方式"
              prop="port_type"
            >
              <el-select
                class="w-full"
                v-model="model.port_type"
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
              v-if="model.port_type === 'ETHERNET'"
              class="important-h-[56px]"
              label="B网IP"
              prop="netb_ip"
            >
              <el-input v-model="model.netb_ip" placeholder="请输入B网IP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="通信地址"
              prop="comm_id"
              v-if="model.port_type === 'COM'"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.comm_id"
                placeholder="请输入通信地址"
              />
            </el-form-item>
            <el-form-item
              v-if="model.port_type === 'ETHERNET'"
              class="important-h-[56px]"
              label="A网IP"
              prop="neta_ip"
            >
              <el-input v-model="model.neta_ip" placeholder="请输入A网IP" />
            </el-form-item>
            <el-form-item
              class="important-h-[56px]"
              v-if="model.port_type === 'ETHERNET'"
              label="端口号"
              prop="port"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.port"
                placeholder="请输入端口号"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { getMainProductDatas } from "@/api/productManage/index";
import type { MainProductData } from "@/api/productManage/types";
import { CreateOrEditDeviceRuleFromRules } from "./rules";
import type { CreateOrEditDeviceRuleFrom } from "./rules";
import { getAllDevicetypes } from "@/api/channelManagement/index";
import type { Drvtypes } from "@/api/channelManagement/type";
import {
  createDevices,
  getChannelIdType,
} from "@/api/deviceInstantiation/index";
import type {
  CreateDeviceDataQuerty,
  ChannelTypeResponse,
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
import {
  getAllChannelNodes,
  getChannelNodes,
} from "@/api/channelManagement/index";
import type { ChannelsResponse } from "@/api/channelManagement/type";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue", "ok"]);

interface DataTree {
  modelLabel_id: string;
  nodeId: number;
  nodeName: string;
  isLeaf: boolean;
  modelLabel: string;
  parentNodeId?: number;
  children?: DataTree[];
}

/*
弹窗显隐控制及弹窗
*/
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    infoType: string;
    currentNode: DataTree;
  }>(),
  {
    modelValue: false,
    infoType: "create",
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

const dialogConfig = reactive({
  title: "新增设备",
  width: "640px",
});

watch(
  () => props.modelValue,
  (val) => {
    nextTick(() => {
      if (val) {
        emptyData();
        if (props.infoType === "edit") {
          dialogConfig.title = "编辑设备";
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增设备";
        }
      }
    });
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<CreateOrEditDeviceRuleFrom>({
  device_name: "",
  product_id: undefined,
  product_name: "",
  product_type: 1,
  channel_id: undefined,
  gateway_id: undefined,
  portal_mode: "",
  comm_id: undefined,
  port_type: "ETHERNET",
  port: undefined,
  addr: "",
  gatewayDeviceType: undefined,
  associated_gateway: undefined,
  acquisition_channel_id: undefined,
  forward_channel_id: undefined,
  neta_ip: "",
  netb_ip: "",
});

const product_name_options = ref<
  { id: number; name: string; product_type: number }[]
>([]);
const product_type_options = ref<{ id: number; name: string }[]>([
  { id: 1, name: "直采" },
  { id: 2, name: "网关子设备" },
]);
function changeProduct(val: number) {
  const product = product_name_options.value.filter((item) => {
    return item.id === val;
  });
  if (product?.length) {
    model.value.product_type = product[0].product_type;
  }
  //   model.value.channel_id = undefined;
}

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
async function changegateway_id(val: number) {
  model.value.acquisition_channel_id = undefined;
  model.value.forward_channel_id = undefined;
  const resGatewayAcquisitionData: UniversalReponse<
    GatewayAcquisitionResponse[]
  > = await getGatewayAcquisitionData(val);
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
        return item.port_type === "COM" || item.port_type === "ETHERNET";
      });
  } else {
    acquisition_channel_options.value = [];
  }
  const resGatewayForwardData: UniversalReponse<GatewayForwardResponse[]> =
    await getGatewayForwardData(val);
  if (resGatewayForwardData.code === 0 && resGatewayForwardData.data?.length) {
    forwarding_channel_options.value = resGatewayForwardData.data
      .map((item) => {
        return {
          id: item.channel_id,
          name: item.channel_name,
          channel_id: item.station_channel_id,
          channel_name: item.station_channel_name,
        };
      })
      .filter((item) => {
        return item.channel_id;
      });
    if (!forwarding_channel_options.value.length) {
      ElMessage.warning("该网关下暂无已启用的转发通道");
    }
  } else {
    forwarding_channel_options.value = [];
  }
  //   model.value.channel_id = gateway_id[0]?.channel_id;
  //   model.value.gatewayDeviceType = gateway_id[0]?.gatewayDeviceType;
}
const acquisition_channel_options = ref<
  { id: number; name: string; port_type: string }[]
>([]);
function change_acquisition_channel_id(val: number) {
  const acquisition_channel = acquisition_channel_options.value.filter(
    (item) => {
      return item.id === val;
    }
  );
  model.value.port_type = acquisition_channel[0].port_type;
}

const forwarding_channel_options = ref<
  { id: number; name: string; channel_id: number; channel_name: string }[]
>([]);
function changeForwardChannel(val: number) {
  const forward_channel_ids = forwarding_channel_options.value?.filter(
    (ite) => ite.id === val
  );
  model.value.channel_id = forward_channel_ids[0]?.channel_id;
}
const associated_channel_options = ref<
  { id: number; name: string; portalMode: string }[]
>([]);
async function queryAllChannelNodes(filterID: number = 0) {
  associated_channel_options.value = [];
  let res: UniversalReponse<ChannelsResponse[]> = await getAllChannelNodes({
    page_size: 1000,
    page: 1,
    node_name: "",
    includeInf: false,
  });
  if (res.code === 0 && res.data?.length) {
    res.data.forEach((item: any) => {
      if (item.channels?.length) {
        item.channels.forEach((ele: any) => {
          const param = {
            id: ele.nodeId,
            name: ele.nodeName,
            portalMode: ele.portalMode,
          };
          if (filterID) {
            if (filterID === ele.parentNodeId) {
              associated_channel_options.value.push(param);
            }
          } else {
            associated_channel_options.value.push(param);
          }
        });
      }
    });
  }
}
async function queryChannelNodes(nodeId: number = 0) {
  associated_channel_options.value = [];
  let res: UniversalReponse<ChannelsResponse[]> = await getChannelNodes({
    page_size: 1000,
    page: 1,
    id: nodeId,
    node_name: "",
    includeInf: false,
    maxDeviceCount: null,
  });
  if (res.code === 0 && res.data?.length) {
    res.data.forEach((item: any) => {
      const param = {
        id: item.nodeId,
        name: item.nodeName,
        portalMode: item.portalMode,
      };
      associated_channel_options.value.push(param);
    });
  }
}

function changechannel_id(val: number) {
  const associated_channel = associated_channel_options.value.filter((item) => {
    return item.id === val;
  });

  model.value.portal_mode = associated_channel[0].portalMode;
}
const portal_modeOptions = ref([
  {
    value: "SERIAL",
    label: "串行",
  },
  {
    value: "PARALLEL",
    label: "并行",
  },
]);
function changeportal_mode(value: string) {
  //   if (value === "PARALLEL") {
  //   } else {
  //   }
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

const isDomain = ref<boolean>(false);
function changeDomainType() {
  if (isDomain.value) {
    CreateOrEditDeviceRuleFromRules.addr = [
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
    CreateOrEditDeviceRuleFromRules.addr = [
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

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let param: CreateDeviceDataQuerty;
      if (
        model.value.product_type === 1 &&
        model.value.portal_mode === "SERIAL"
      ) {
        param = {
          device_name: model.value.device_name ? model.value.device_name : "",
          product_id: model.value.product_id ? model.value.product_id : 0,
          channel_id: model.value.channel_id ? model.value.channel_id : 0,
          comm_config: {
            comm_id: model.value.comm_id,
          },
        };
      } else if (
        model.value.product_type === 1 &&
        model.value.portal_mode === "PARALLEL" &&
        model.value.port_type === "ETHERNET"
      ) {
        param = {
          device_name: model.value.device_name ? model.value.device_name : "",
          product_id: model.value.product_id ? model.value.product_id : 0,
          channel_id: model.value.channel_id ? model.value.channel_id : 0,
          port_type: "ETHERNET",
          comm_config: {
            comm_id: model.value.comm_id,
            addr: model.value.addr,
            port: model.value.port,
          },
        };
      } else if (
        model.value.product_type === 2 &&
        model.value.port_type === "COM"
      ) {
        param = {
          device_name: model.value.device_name ? model.value.device_name : "",
          product_id: model.value.product_id ? model.value.product_id : 0,
          channel_id: model.value.channel_id ? model.value.channel_id : 0,
          //   port_type: "COM",
          comm_config: {
            acquisition_channel_id: model.value.acquisition_channel_id,
            // forward_channel_id: model.value.forward_channel_id,
            gateway_id: model.value.gateway_id,
            gateway_config: {
              comm_id: model.value.comm_id,
            },
          },
        };
      } else if (
        model.value.product_type === 2 &&
        model.value.port_type === "ETHERNET"
      ) {
        param = {
          device_name: model.value.device_name ? model.value.device_name : "",
          product_id: model.value.product_id ? model.value.product_id : 0,
          channel_id: model.value.channel_id ? model.value.channel_id : 0,
          //   port_type: "ETHERNET",
          comm_config: {
            acquisition_channel_id: model.value.acquisition_channel_id,
            // forward_channel_id: model.value.forward_channel_id,
            gateway_id: model.value.gateway_id,
            gateway_config: {
              comm_id: model.value.comm_id,
              neta_ip: model.value.neta_ip ? model.value.neta_ip : undefined,
              netb_ip: model.value.netb_ip ? model.value.netb_ip : undefined,
              port: model.value.port,
            },
          },
        };
      } else {
        param = {
          device_name: model.value.device_name ? model.value.device_name : "",
          product_id: model.value.product_id ? model.value.product_id : 0,
          channel_id: model.value.channel_id ? model.value.channel_id : 0,
          product_type: model.value.product_type,
        };
      }
      const res = await createDevices(param);
      if (res.code === 0) {
        ElMessage.success("新增设备成功！");
        show.value = false;
        emit("ok");
      }
    }
  });
}
function cancel() {
  show.value = false;
}

async function getProductDatas() {
  product_name_options.value = [];
  let res: UniversalReponse<MainProductData[]>;
  res = await getMainProductDatas({
    page_size: 1000,
    page: 1,
    key_name: "",
  });
  if (res.code === 0 && res.data?.length) {
    product_name_options.value = res.data
      .filter((item) => {
        return (
          item.is_release &&
          (item.product_type === model.value.product_type ||
            props.currentNode.modelLabel !== "channel")
        );
      })
      .map((item) => {
        return {
          id: item.product_id,
          name: item.product_name,
          product_type: item.product_type,
        };
      });
    if (!product_name_options.value.length) {
      ElMessage.warning("暂无已上线的产品");
    }
  } else {
    product_name_options.value = [];
  }
}

async function emptyData() {
  model.value = {
    device_name: "",
    product_id: undefined,
    product_name: "",
    product_type: 1,
    channel_id:
      props.currentNode?.modelLabel === "channel"
        ? props.currentNode.nodeId
        : undefined,
    gateway_id: undefined,
    portal_mode: "",
    comm_id: undefined,
    port_type: "ETHERNET",
    port: undefined,
    addr: "",
    gatewayDeviceType: undefined,
    associated_gateway: undefined,
    acquisition_channel_id: undefined,
    forward_channel_id: undefined,
    neta_ip: "",
    netb_ip: "",
  };

  if (props.currentNode?.modelLabel === "channel") {
    await queryChannelNodes(props.currentNode.parentNodeId);
    const associated_channel = associated_channel_options.value.filter(
      (item) => {
        return item.id === props.currentNode.nodeId;
      }
    );
    const param = {
      page_size: 1000,
      page: 1,
      station_id: props.currentNode.parentNodeId,
    };
    const resGatewayMainData: UniversalReponse<GatewayMainResponse[]> =
      await getGatewayMainData(param);
    if (resGatewayMainData.code === 0 && resGatewayMainData.data.length) {
      associated_gateway_options.value = resGatewayMainData.data.map((item) => {
        return {
          id: item.gateway_id,
          name: item.gateway_name,
        };
      });
    }
    model.value.portal_mode = associated_channel[0].portalMode;
    const resChannelIdType: UniversalReponse<ChannelTypeResponse> =
      await getChannelIdType(props.currentNode.nodeId);

    if (resChannelIdType.code === 0 && resChannelIdType.data) {
      model.value.gateway_id = resChannelIdType.data.type_param.gateway_id;
      model.value.product_type = resChannelIdType.data.channel_type;
    }
    if (resChannelIdType.data.channel_type === 2) {
      model.value.forward_channel_id =
        resChannelIdType.data.type_param.forward_channel_id;
      const resGatewayAcquisitionData: UniversalReponse<
        GatewayAcquisitionResponse[]
      > = await getGatewayAcquisitionData(model.value.gateway_id as number);
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
            return item.port_type === "COM" || item.port_type === "ETHERNET";
          });
      } else {
        acquisition_channel_options.value = [];
      }
      const resGatewayForwardData: UniversalReponse<GatewayForwardResponse[]> =
        await getGatewayForwardData(model.value.gateway_id as number);
      if (
        resGatewayForwardData.code === 0 &&
        resGatewayForwardData.data?.length
      ) {
        forwarding_channel_options.value = resGatewayForwardData.data
          .map((item) => {
            return {
              id: item.channel_id,
              name: item.channel_name,
              channel_id: item.station_channel_id,
              channel_name: item.station_channel_name,
            };
          })
          .filter((item) => {
            return item.channel_id;
          });
        if (!forwarding_channel_options.value.length) {
          ElMessage.warning("该网关下暂无已启用的转发通道");
        }
      } else {
        forwarding_channel_options.value = [];
      }
    }
  } else if (props.currentNode?.modelLabel === "station") {
    await queryChannelNodes(props.currentNode.nodeId);
    const param = {
      page_size: 1000,
      page: 1,
      station_id: props.currentNode.nodeId,
    };
    const resGatewayMainData: UniversalReponse<GatewayMainResponse[]> =
      await getGatewayMainData(param);
    if (resGatewayMainData.code === 0 && resGatewayMainData.data.length) {
      associated_gateway_options.value = resGatewayMainData.data.map((item) => {
        return {
          id: item.gateway_id,
          name: item.gateway_name,
        };
      });
    }
  } else if (props.currentNode?.modelLabel === "all") {
    await queryAllChannelNodes();
    const param = {
      page_size: 1000,
      page: 1,
    };
    const resGatewayMainData: UniversalReponse<GatewayMainResponse[]> =
      await getGatewayMainData(param);
    if (resGatewayMainData.code === 0 && resGatewayMainData.data.length) {
      associated_gateway_options.value = resGatewayMainData.data.map((item) => {
        return {
          id: item.gateway_id,
          name: item.gateway_name,
        };
      });
    }
  }
  await getProductDatas();
}

onActivated(async () => {
  //   await getAllTypesDate();
  //   await queryAllChannelNodes();
  //   getProductDatas();
});
</script>
<style lang="scss">
.deviceInstantiation-createOrEditDevicePage {
  margin-top: 6vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .createOrEditDeviceForm {
    .el-form-item {
      margin-bottom: 16px;

      .el-form-item__label {
        @include font_color("T1");
        padding: 0 !important;
        line-height: 20px !important;
      }
      .el-textarea__inner {
        height: 100% !important;
      }
    }
    .el-input-number.is-without-controls .el-input__wrapper {
      width: 100% !important;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
