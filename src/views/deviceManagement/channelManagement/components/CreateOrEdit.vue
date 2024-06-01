<template>
  <div class="h-full">
    <div class="w-full mb-4 h-[24px]">
      <div class="float-left cursor-pointer" @click="cancel">
        <DArrowLeft
          style="width: 20px; height: 20px; margin-right: 8px"
        ></DArrowLeft>
        <span class="text-T2 text-[18px] font-medium">{{ title }}</span>
      </div>
      <el-button class="float-right" type="primary" @click="save(ruleFormRef)"
        >保存</el-button
      >
      <el-button class="float-right mr-2" @click="cancel">取消</el-button>
    </div>
    <div class="h-[calc(100%-40px)] createOrEditContent">
      <el-form
        ref="ruleFormRef"
        class="createOrEditForm h-full"
        label-position="top"
        :model="basicConfigModel"
        :rules="createOrEditFormRules"
      >
        <el-tabs
          v-model="activeName"
          class="h-full"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane lazy label="基础配置" name="基础配置">
            <div class="mb-6">
              <div class="font-medium text-T1 mb-4">基础信息</div>
              <el-row
                :gutter="20"
                class="mt-4 important-h-[72px] border-b-[1px] border-BG"
              >
                <el-col
                  class="important-w-[488px] important-max-w-[488px] important-flex-auto important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="通道名称"
                    prop="nodeName"
                  >
                    <el-input
                      v-model="basicConfigModel.nodeName"
                      placeholder="请输入通道名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="驱动类型"
                    prop="drvType"
                  >
                    <el-select
                      v-model="basicConfigModel.drvType"
                      placeholder="请选择驱动类型"
                      class="w-[328px]"
                    >
                      <el-option
                        v-for="item in drvTypeOptions"
                        :key="item.nodeId"
                        :label="item.nodeName"
                        :value="item.nodeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="巡检方式"
                    prop="portalMode"
                  >
                    <el-select
                      v-model="basicConfigModel.portalMode"
                      placeholder="请选择巡检方式"
                      class="w-[328px]"
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
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    :class="{ 'is-required': !portTypeDisAble }"
                    label="通信方式"
                    prop="portType"
                  >
                    <el-select
                      v-model="basicConfigModel.portType"
                      :disabled="portTypeDisAble"
                      :required="!portTypeDisAble"
                      placeholder="请选择通信方式"
                      class="w-[328px]"
                    >
                      <el-option
                        v-for="item in portTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">串口</div>
              <el-row
                :gutter="20"
                class="mt-4 important-h-[72px] border-b-[1px] border-BG"
              >
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="串口号"
                    prop="portNum"
                  >
                    <el-select-v2
                      v-model="basicConfigModel.portNum"
                      :options="portNumOptions"
                      :disabled="
                        portTypeDisAble ||
                        basicConfigModel.portType === 'ETHERNET'
                      "
                      placeholder="请输入串口号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="波特率"
                    prop="baudRate"
                  >
                    <el-select
                      v-model="basicConfigModel.baudRate"
                      placeholder="请输入波特率"
                      :disabled="
                        portTypeDisAble ||
                        basicConfigModel.portType === 'ETHERNET'
                      "
                      clearable
                    >
                      <el-option
                        v-for="item in baudRateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    /></el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="校验位"
                    prop="parity"
                  >
                    <el-select
                      v-model="basicConfigModel.parity"
                      placeholder="请输入校验位"
                      :disabled="
                        portTypeDisAble ||
                        basicConfigModel.portType === 'ETHERNET'
                      "
                      clearable
                    >
                      <el-option
                        v-for="item in parityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="数据位"
                    prop="byteSize"
                  >
                    <el-select
                      v-model="basicConfigModel.byteSize"
                      placeholder="请输入数据位"
                      :disabled="
                        portTypeDisAble ||
                        basicConfigModel.portType === 'ETHERNET'
                      "
                      clearable
                    >
                      <el-option
                        v-for="item in byteSizeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="停止位"
                    prop="stopBits"
                  >
                    <el-select
                      v-model="basicConfigModel.stopBits"
                      placeholder="请输入停止位"
                      :disabled="
                        portTypeDisAble ||
                        basicConfigModel.portType === 'ETHERNET'
                      "
                      clearable
                    >
                      <el-option
                        v-for="item in stopBitsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1"><span>TCP/IP</span></div>
              <el-checkbox
                :disabled="
                  portTypeDisAble || basicConfigModel.portType === 'COM'
                "
                v-model="isDomain"
                label="域名方式"
                size="large"
                @change="changeDomainType"
              />
              <el-row
                :gutter="20"
                class="important-h-[72px] border-b-[1px] border-BG"
              >
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="主IP"
                    prop="remoteAddr"
                  >
                    <el-input
                      :disabled="
                        portTypeDisAble || basicConfigModel.portType === 'COM'
                      "
                      v-model="basicConfigModel.remoteAddr"
                      placeholder="请输入主IP"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="端口号"
                    prop="port"
                  >
                    <el-input
                      :disabled="
                        portTypeDisAble || basicConfigModel.portType === 'COM'
                      "
                      v-model="basicConfigModel.port"
                      placeholder="请输入端口号"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">厂站</div>
              <el-row :gutter="20" class="mt-4 important-h-[56px]">
                <el-col
                  :span="4"
                  class="important-max-w-[244px] important-px-3"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="关联厂站"
                    prop="stationId"
                  >
                    <el-select
                      v-model="basicConfigModel.stationId"
                      :disabled="isEdit"
                      placeholder="请选择关联厂站"
                      class="w-[328px]"
                    >
                      <el-option
                        v-for="item in stationOptions"
                        :key="item.nodeId"
                        :label="item.nodeName"
                        :value="item.nodeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane lazy label="高级配置" name="高级配置">
            <div class="mb-6">
              <div class="font-medium text-T1 mb-4">时间设置</div>
              <el-row :gutter="20" class="mt-4 important-h-[56px] advanced">
                <el-col
                  class="important-w-[280px] important-max-w-[280px] important-flex-auto"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="对时间隔"
                    prop="adjustTimeInterval"
                  >
                    <div class="flex">
                      <el-input-number
                        class="important-w-[236px] important-max-w-[236px] important-flex-auto"
                        :controls="false"
                        v-model="basicConfigModel.adjustTimeInterval"
                        placeholder="请输入对时间隔"
                      >
                      </el-input-number>
                      <span
                        class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] border-y-1 border-r-1 border-B1 bg-BG rounded-r-[4px]"
                        >秒</span
                      >
                    </div>
                  </el-form-item>
                </el-col>
                <el-col
                  class="important-w-[280px] important-max-w-[280px] important-flex-auto ml-6"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="头字节等待时间"
                    prop="transmitDelay"
                  >
                    <div class="flex">
                      <el-input-number
                        min="0"
                        class="important-w-[236px] important-max-w-[236px] important-flex-auto"
                        :controls="false"
                        v-model="basicConfigModel.transmitDelay"
                        placeholder="请输入头字节等待时间"
                      >
                      </el-input-number>
                      <span
                        class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] border-y-1 border-r-1 border-B1 bg-BG"
                        >秒</span
                      >
                    </div>
                  </el-form-item>
                </el-col>
                <el-col
                  class="important-w-[280px] important-max-w-[280px] important-flex-auto ml-6"
                >
                  <el-form-item
                    class="important-h-[56px]"
                    label="设备连续通信出错多少次后将自动退出"
                    prop="repeatTimes"
                  >
                    <div class="flex">
                      <el-input-number
                        min="0"
                        class="important-w-[236px] important-max-w-[236px] important-flex-auto"
                        :controls="false"
                        v-model="basicConfigModel.repeatTimes"
                        placeholder="请输入设备连续通信出错多少次后将自动退出"
                      >
                      </el-input-number>
                      <span
                        class="inline-block h-[32px] text-[14px] px-[16px] py-[6px] w-[43px] leading-[20px] h-[30px] border-y-1 border-r-1 border-B1 bg-BG"
                        >次</span
                      >
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">调试信息设置</div>
              <div>
                <el-checkbox
                  v-model="basicConfigModel.writeConsoleInfo"
                  :true-label="1"
                  :false-label="0"
                  label="显示调试信息"
                  size="large"
                />
                <el-checkbox
                  v-model="basicConfigModel.writeDebugInfo"
                  :true-label="1"
                  :false-label="0"
                  label="保存调试信息"
                  size="large"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane lazy label="扩展配置" name="扩展配置">
            <div class="font-medium text-T1 mb-4">
              {{ isShowInf ? "通道inf" : "配置项列表" }}
            </div>
            <el-input
              v-if="isShowInf"
              class="h-full"
              resize="none"
              v-model="textareaInf"
              type="textarea"
              placeholder="请输入通道inf"
            />
            <el-table
              v-else
              ref="infoTableRef"
              :data="infoTableData"
              style="width: 100%; height: 100%"
            >
              <template v-for="item in infoTableColumn" :key="item.prop">
                <el-table-column v-bind="item" />
              </template>
              <el-table-column
                label="当前值"
                prop="value"
                min-width="100px"
                align="center"
              >
                <template #default="scope">
                  <el-input-number
                    class="h-full"
                    v-model="scope.row.value"
                    :controls="false"
                  ></el-input-number>
                  <svg-icon
                    class="inline-block important-w-[20px] important-h-[20px] cursor-pointer relative right-[30px] top-[4px]"
                    icon-class="reset"
                    @click="resetValue(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DArrowLeft, Message } from "@element-plus/icons-vue";
import { createOrEditFormRules, infoTableColumn } from "./rules";
import type { BasicConfigModel, InfValue } from "./rules";
import type { OptionType } from "@/views/systemNetworkNodeManagement/components/rules";
import type { FormInstance } from "element-plus";
import {
  getAllDrvtypes,
  getChannelNodesById,
  addChannels,
  editeChannels,
} from "@/api/channelManagement/index";
import type { Drvtypes, ChannelData } from "@/api/channelManagement/type";
import { isValidKey } from "@/utils/index";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue", "infoTOMain"]);

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    isEdit: boolean;
    currentNode: any;
    stationOptions: OptionType[];
  }>(),
  {
    modelValue: false,
    isEdit: false,
    currentNode: () => {
      return {};
    },
    stationOptions: () => [],
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
        if (!props.isEdit) {
          lastId.value = 0;
          title.value = "新增通道";
          emptyData(ruleFormRef.value);
        } else {
          title.value = "编辑通道";
          if (
            lastId.value !== props.currentNode.nodeId ||
            !isReturnMain.value
          ) {
            emptyData(ruleFormRef.value);
            lastId.value = props.currentNode.nodeId;
            // formatterInfList(props.currentNode.infValueList)
            getChannelNodes();
          }
        }
      });
    }
  },
  { immediate: true }
);

watch(
  () => props.stationOptions,
  (val) => {
    nextTick(() => {
      stationOptions.value = val;
    });
  },
  { deep: true, immediate: true }
);

async function createOrEdite() {
  const param = { isCustomInf: true };
  let drvName: string = "";
  drvTypeOptions.value.forEach((item) => {
    if (item.nodeId === basicConfigModel.drvType) {
      drvName = item.nodeName;
    }
  });
  const basicParam = {
    drvName: drvName,
    nodeName: basicConfigModel.nodeName,
    portType: basicConfigModel.portType,
    portalMode: basicConfigModel.portalMode,
  };
  const comParam = {
    baudRate: basicConfigModel.baudRate ? basicConfigModel.baudRate : null,
    byteSize: basicConfigModel.byteSize ? basicConfigModel.byteSize : null,
    parity: basicConfigModel.parity ? basicConfigModel.parity : null,
    portNum: basicConfigModel.portNum ? basicConfigModel.portNum : null,
    stopBits: basicConfigModel.stopBits ? basicConfigModel.stopBits : null,
  };
  const communicationParam = {
    port: basicConfigModel.port ? Number(basicConfigModel.port) : null,
    remoteAddr: basicConfigModel.remoteAddr
      ? basicConfigModel.remoteAddr
      : null,
  };

  const advancedParam = {
    adjustTimeInterval: basicConfigModel.adjustTimeInterval
      ? basicConfigModel.adjustTimeInterval
      : null,
    transmitDelay: basicConfigModel.transmitDelay
      ? basicConfigModel.transmitDelay
      : null,
    repeatTimes: basicConfigModel.repeatTimes
      ? basicConfigModel.repeatTimes
      : null,
    writeConsoleInfo: basicConfigModel.writeConsoleInfo
      ? basicConfigModel.writeConsoleInfo
      : 0,
    writeDebugInfo: basicConfigModel.writeDebugInfo
      ? basicConfigModel.writeDebugInfo
      : 0,
  };

  const customInf = textareaInf.value;
  const paramData = {
    basicParam,
    comParam,
    communicationParam,
    advancedParam,
    customInf: customInf ? customInf : null,
  };
  if (props.isEdit) {
    (paramData as any).channelId = basicConfigModel.nodeId;
    const res = await editeChannels(param, [paramData]);
    if (res.code === 0) {
      ElMessage.success("编辑成功");
      emit("update:modelValue", false);
      isReturnMain.value = false;
    }
  } else {
    (param as any).id = basicConfigModel.stationId;
    const res = await addChannels(param, [paramData]);
    if (res.code === 0) {
      ElMessage.success("新增成功");
      emit("update:modelValue", false);
      isReturnMain.value = false;
    }
  }
  emit("infoTOMain");
}

const title = ref<string>("新增通道");
const lastId = ref<number>(0);
async function save(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      createOrEdite();
    }
  });
}
function cancel() {
  const warningMsg = props.isEdit ? "确定要取消编辑吗" : "确定要取消新增吗";
  ElMessageBox.confirm(warningMsg, "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      emit("update:modelValue", false);
      isReturnMain.value = false;
      emit("infoTOMain");
    })
    .catch(() => {
      ElMessage.info("操作已取消");
    });
}
const isReturnMain = ref<boolean>(false);
function returnMain() {
  emit("update:modelValue", false);
  isReturnMain.value = true;
}

const activeName = ref<string>("基础配置");
function handleClick() {
  console.log(2222);
}

const ruleFormRef = ref<FormInstance>();
const basicConfigModel = reactive<BasicConfigModel>({
  nodeId: "",
  nodeName: "",
  drvType: "",
  portalMode: "SERIAL",
  portType: "COM",
  port: 502,
  baudRate: 9600,
  parity: "no",
  byteSize: 8,
  stopBits: 1,
  remoteAddr: "191.0.0.1",
  portNum: 1,
  stationId: "",
  adjustTimeInterval: 3600,
  transmitDelay: 20,
  repeatTimes: 5,
  writeConsoleInfo: 0,
  writeDebugInfo: 0,
});

const drvTypeOptions = ref<Drvtypes[]>([]);

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

const portNumOptions = Array.from({ length: 255 }).map((_, idx) => ({
  value: idx + 1,
  label: `串口${idx + 1}`,
}));

const baudRateOptions = ref<{ value: number; label: string }[]>([
  { value: 300, label: "300" },
  { value: 600, label: "600" },
  { value: 1200, label: "1200" },
  { value: 2400, label: "2400" },
  { value: 4800, label: "4800" },
  { value: 9600, label: "9600" },
  { value: 19200, label: "19200" },
  { value: 38400, label: "38400" },
  { value: 57600, label: "57600" },
]);

const parityOptions = ref<{ value: string; label: string }[]>([
  { value: "no", label: "无" },
  { value: "even", label: "偶" },
  { value: "odd", label: "奇" },
  { value: "mark", label: "标志" },
  { value: "space", label: "空格" },
]);

const byteSizeOptions = ref<{ value: number; label: string }[]>([
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
]);

const stopBitsOptions = ref<{ value: number; label: string }[]>([
  { value: 1, label: "1" },
  { value: 1.5, label: "1.5" },
  { value: 2, label: "2" },
]);

function changePortalMode(value: string) {
  if (value === "PARALLEL") {
    portTypeDisAble.value = true;
    basicConfigModel.portType = "ETHERNET";
    (createOrEditFormRules as any).portType.required = false;
  } else {
    portTypeDisAble.value = false;
    basicConfigModel.portType = "COM";
    (createOrEditFormRules as any).portType.required = true;
  }
}

const portTypeDisAble = ref<boolean>(false);
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
    createOrEditFormRules.remoteAddr = {
      pattern:
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, // https://regexr.com
      message: "请输入正确的域名",
      trigger: ["blur", "change"],
    };
  } else {
    createOrEditFormRules.remoteAddr = {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    };
  }
}

const stationOptions = ref<OptionType[]>([]);

// 表单清空
function emptyData(formEl: FormInstance | undefined) {
  initData();
  activeName.value = "基础配置";
  formEl?.clearValidate();
  let key: keyof BasicConfigModel;
  for (key in basicConfigModel) {
    basicConfigModel[key] = "";
  }
  basicConfigModel.portalMode = "SERIAL";
  basicConfigModel.portType = "COM";
  basicConfigModel.portNum = 1;
  basicConfigModel.baudRate = 9600;
  basicConfigModel.parity = "no";
  basicConfigModel.byteSize = 8;
  basicConfigModel.stopBits = 1;
  basicConfigModel.port = 502;
  basicConfigModel.remoteAddr = "191.0.0.1";
  basicConfigModel.adjustTimeInterval = 3600;
  basicConfigModel.transmitDelay = 20;
  basicConfigModel.repeatTimes = 5;
  basicConfigModel.writeConsoleInfo = 0;
  basicConfigModel.writeDebugInfo = 0;
  textareaInf.value = "";
  portTypeDisAble.value = false;
  (createOrEditFormRules as any).portType.required = true;
}

function formatterInfList(infList: InfValue[]) {
  isDomain.value = false;
  infList?.forEach((item) => {
    let key = item.key.replace(item.key[0], item.key[0].toLowerCase());
    if (key in basicConfigModel) {
      basicConfigModel[key] = item.value;
      if (key === "remoteAddr") {
        const regexr =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!regexr.test(item.value + "")) {
          isDomain.value = true;
        }
      }
    }
  });
  basicConfigModel.nodeName = props.currentNode.nodeName;
  basicConfigModel.nodeId = props.currentNode.nodeId;
  basicConfigModel.stationId = props.currentNode.stationId;
  basicConfigModel.portType = props.currentNode.portType;
  basicConfigModel.portalMode = props.currentNode.portalMode;
  basicConfigModel.drvType = props.currentNode.drvType;
}

async function getChannelNodes() {
  let param = {
    isCustomInf: true,
    includeInf: false,
  };
  let paramData = [props.currentNode.nodeId as number];
  const res = await getChannelNodesById(param, paramData);
  if (res.code === 0 && res.data?.length) {
    const { advancedParam, basicParam, comParam, communicationParam } =
      res.data[0];
    const keyObjects = {
      advancedParam: advancedParam,
      basicParam: basicParam,
      comParam: comParam,
      communicationParam: communicationParam,
    };
    for (let keys in keyObjects) {
      for (let key in keyObjects[keys]) {
        if (isValidKey(key, basicConfigModel)) {
          basicConfigModel[key] = keyObjects[keys][key];
        }
      }
    }
    drvTypeOptions.value.forEach((item) => {
      if (item.nodeName === basicParam.drvName) {
        basicConfigModel.drvType = item.nodeId;
      }
    });
    basicConfigModel.nodeId = props.currentNode.nodeId;
    basicConfigModel.stationId = res.data[0].staId;
    textareaInf.value = res.data[0].customInf + "";
    if (basicConfigModel.portalMode === "PARALLEL") {
      portTypeDisAble.value = true;
      (createOrEditFormRules as any).portType.required = false;
    }
  }
}

const infoTableRef = ref();
const infoTableData = ref<object[]>([]);
const isShowInf = ref<boolean>(true);
const textareaInf = ref<string>(
  "[DbgTrace]\nWarnFileNum=9\nToFile=1\nLogInfoLevel=2\nToConsole=1\nLogLevel=INFO\nWarnFileSize=10\n\n[main]\nSNTPPeriod=601\nSNTPPort=12313\n\n"
);
function resetValue(id: number) {
  infoTableData.value.forEach((item: any) => {
    if (item.id === id) {
      item.value = item.orivalue;
    }
  });
}

async function initData() {
  const data = [];
  for (var i = 0; i < 100; i++) {
    const value = parseInt(Math.random() * 100 + "");
    let param = {
      id: i,
      name: "SNTPPort" + "-" + i,
      type: "整型" + "-" + i,
      descript: "时间服务器端口(默认值:123)" + "-" + i,
      orivalue: value,
      value: value,
    };
    data.push(param);
  }
  infoTableData.value = data;

  const res = await getAllDrvtypes();
  if (res.code === 0 && res.data?.length) {
    drvTypeOptions.value = res.data;
  }
}
</script>
<style scoped lang="scss">
.createOrEditContent {
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
  }

  :deep(.el-tabs__content) {
    height: calc(100% - 56px);
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }

  :deep(.el-textarea__inner) {
    height: calc(100% - 40px);
  }
}
</style>
