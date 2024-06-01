<template>
  <div class="h-full">
    <div class="w-full mb-4 h-[24px]">
      <div class="float-left cursor-pointer" @click="cancel">
        <DArrowLeft
          style="width: 20px; height: 20px; margin-right: 8px"
        ></DArrowLeft>
        <span class="text-T2 text-[18px] font-medium">{{ title }}</span>
      </div>
      <el-button class="float-right" type="primary" @click="edit"
        >编辑</el-button
      >
    </div>
    <div class="h-[calc(100%-40px)] infoDetailContent">
      <el-tabs
        v-model="activeName"
        class="h-full"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane lazy label="基础配置" name="基础配置">
          <el-form
            ref="ruleFormRef"
            class="createOrEditForm"
            label-position="top"
            :model="infoConfigModel"
            :rules="createOrEditFormRules"
          >
            <div class="mb-6 border-b-[1px] border-BG">
              <div class="font-medium text-T1 mb-4">基础信息</div>
              <el-row
                :gutter="20"
                class="mt-4 important-h-[36px] border-b-[1px] border-BG"
              >
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">通道名称：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.nodeName
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">驱动类型：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.drvName
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">巡检方式：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.portalModeName
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">通信方式：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.portTypeName
                    }}</span>
                  </div>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">串口</div>
              <el-row
                :gutter="20"
                class="mt-4 important-h-[36px] border-b-[1px] border-BG"
              >
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">串口号：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.portNum
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">波特率：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.baudRate
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">数据位：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.byteSize
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">校验位：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.parityName
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">停止位：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.stopBits
                    }}</span>
                  </div>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">TCP/IP</div>
              <el-row
                :gutter="20"
                class="mt-4 important-h-[36px] border-b-[1px] border-BG"
              >
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">主IP：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.remoteAddr
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">端口号：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.port
                    }}</span>
                  </div>
                </el-col>
              </el-row>
              <div class="mt-6 font-medium text-T1 mb-4">厂站</div>
              <el-row :gutter="20" class="mt-4 important-h-[56px]">
                <el-col :span="4">
                  <div class="w-full">
                    <span class="text-T4 mr-2 text-[14px]">关联厂站：</span>
                    <span class="text-T2 text-[14px]">{{
                      infoConfigModel.stationName
                    }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane lazy label="高级配置" name="高级配置">
          <div class="mb-6 border-b-[1px] border-BG">
            <div class="mt-6 font-medium text-T1 mb-4">时间设置</div>
            <el-row :gutter="20" class="mt-4 important-h-[56px]">
              <el-col :span="4">
                <div class="w-full">
                  <span class="text-T4 mr-2 text-[14px]">对时间隔：</span>
                  <span class="text-T2 text-[14px]">{{
                    infoConfigModel.adjustTimeInterval
                  }}</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="w-full">
                  <span class="text-T4 mr-2 text-[14px]">设备巡检间隔：</span>
                  <span class="text-T2 text-[14px]">{{
                    infoConfigModel.transmitDelay
                  }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="w-full">
                  <span class="text-T4 mr-2 text-[14px]"
                    >设备连续通信出错多少次后将自动退出：</span
                  >
                  <span class="text-T2 text-[14px]">{{
                    infoConfigModel.repeatTimes
                  }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="mt-6 font-medium text-T1 mb-4">调试信息设置</div>
          <div>
            <el-checkbox
              :disabled="true"
              v-model="infoConfigModel.writeConsoleInfo"
              :true-label="1"
              :false-label="0"
              label="显示调试信息"
              size="large"
            />
            <el-checkbox
              :disabled="true"
              v-model="infoConfigModel.writeDebugInfo"
              :true-label="1"
              :false-label="0"
              label="保存调试信息"
              size="large"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane lazy label="扩展配置" name="扩展配置">
          <div class="font-medium text-T1 mb-4">配置项列表</div>
          <el-input
            v-if="isShowInf"
            :disabled="true"
            class="h-full"
            resize="none"
            v-model="textareaInf"
            type="textarea"
            placeholder="请输入通道inf"
          />
          <el-table
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
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DArrowLeft } from "@element-plus/icons-vue";
import { createOrEditFormRules, infoTableColumn } from "./rules";
import type { InfoConfigModel, InfValue } from "./rules";
import { getChannelNodesById } from "@/api/channelManagement/index";
import { isValidKey } from "@/utils/index";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue", "infoToEdit", "infoTOMain"]);

/*
弹窗显隐控制及弹窗
*/
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    currentNode: any;
  }>(),
  {
    modelValue: false,
    currentNode: () => {
      return {};
    },
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

const title = ref<string>("查看通道");
function edit() {
  emit("update:modelValue", false);
  emit("infoToEdit");
}
function cancel() {
  emit("update:modelValue", false);
  emit("infoTOMain");
}

watch(
  () => [props.currentNode, props.modelValue],
  ([newVal, newVal1], [oldVal, oldVal1]) => {
    nextTick(() => {
      if (newVal?.nodeId && newVal1) {
        emptyData();
        // formatterInfList(props.currentNode.infValueList)
        getChannelNodes();
      }
    });
  }
);

const activeName = ref<string>("基础配置");
function handleClick() {}

const infoConfigModel = reactive<InfoConfigModel>({
  nodeName: "",
  drvName: "",
  portalModeName: "",
  portTypeName: "",
  port: "",
  baudRate: "",
  parityName: "",
  byteSize: "",
  stopBits: "",
  remoteAddr: "",
  remotePort: "",
  portNum: "",
  stationName: "",
  adjustTimeInterval: "",
  transmitDelay: "",
  repeatTimes: "",
  writeConsoleInfo: "",
  writeDebugInfo: "",
});

// 表单清空
function emptyData() {
  let key: keyof InfoConfigModel;
  for (key in infoConfigModel) {
    infoConfigModel[key] = "";
  }
}
function formatterInfList(infList: InfValue[]) {
  infList?.forEach((item) => {
    let key = item.key.replace(item.key[0], item.key[0].toLowerCase());
    if (key in infoConfigModel) {
      infoConfigModel[key] = item.value;
    }
    if (key === "parity") {
      const parity = {
        even: "偶校验",
        odd: "奇校验",
        no: "无",
        mark: "标识",
        space: "空格",
      };
      infoConfigModel.parityName = (parity as any)[item.value];
    }
  });
  infoConfigModel.nodeName = props.currentNode.nodeName;
  infoConfigModel.nodeId = props.currentNode.nodeId;
  infoConfigModel.stationName = props.currentNode.stationName;
  infoConfigModel.portalModeName =
    props.currentNode.portalMode === "SERIAL"
      ? "串行"
      : props.currentNode.portalMode === "PARALLEL"
      ? "并行"
      : "--";
  infoConfigModel.portTypeName =
    props.currentNode.portType === "COM"
      ? "串口"
      : props.currentNode.portType === "ETHERNET"
      ? "以太网"
      : "--";
  infoConfigModel.drvName = props.currentNode.drvTypeName;
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
        if (key === "parity") {
          const parity = {
            even: "偶校验",
            odd: "奇校验",
            no: "无",
            mark: "标识",
            space: "空格",
          };
          infoConfigModel.parityName = (parity as any)[keyObjects[keys][key]];
        }
        if (isValidKey(key, infoConfigModel)) {
          infoConfigModel[key] = keyObjects[keys][key];
        }
      }
    }
    infoConfigModel.portalModeName =
      basicParam.portalMode === "SERIAL"
        ? "串行"
        : basicParam.portalMode === "PARALLEL"
        ? "并行"
        : "--";
    infoConfigModel.portTypeName =
      basicParam.portType === "COM"
        ? "串口"
        : basicParam.portType === "ETHERNET"
        ? "以太网"
        : "--";
    infoConfigModel.nodeId = props.currentNode.nodeId;
    infoConfigModel.stationName = res.data[0].staName + "";
    textareaInf.value = res.data[0].customInf + "";
  }
}

const infoTableRef = ref();
const infoTableData = ref([{}]);
const isShowInf = ref<boolean>(true);
const textareaInf = ref<string>("");

function initData() {
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
}
initData();
</script>
<style scoped lang="scss">
.infoDetailContent {
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
