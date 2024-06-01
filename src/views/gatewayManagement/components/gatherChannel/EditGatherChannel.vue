<template>
  <el-dialog
    class="gatewayManagement-editAcquisition important-rounded-[12px]"
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
      :rules="EditChannelRuleFromRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="通道名称"
              prop="channel_name"
            >
              <el-input
                v-model="model.channel_name"
                placeholder="请输入通道名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item
              class="important-h-[64px]"
              label="规约类型"
              prop="protocol_id"
            >
              <el-select
                class="w-full"
                v-model="model.protocol_id"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in protocol_idOptions"
                  :key="item.protocol_id"
                  :label="item.protocol_desc"
                  :value="item.protocol_id"
                />
              </el-select>
            </el-form-item></el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-if="showSerial"
        >
          <el-col :span="12">
            <el-form-item
              class="important-h-[56px]"
              label="波特率"
              prop="baud_rate"
            >
              <el-select
                class="w-[328px]"
                v-model="model.baud_rate"
                placeholder="请选择波特率"
              >
                <el-option
                  v-for="item in baud_rateOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="校验位"
              prop="parity_bit"
            >
              <el-select
                class="w-[328px]"
                v-model="model.parity_bit"
                placeholder="请选择校验位"
              >
                <el-option
                  v-for="item in parity_bitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-if="showSerial"
        >
          <el-col :span="12">
            <el-form-item
              class="important-h-[56px]"
              label="数据位"
              prop="data_bit"
            >
              <el-select
                class="w-[328px]"
                v-model="model.data_bit"
                placeholder="请选择数据位"
              >
                <el-option
                  v-for="item in data_bitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[56px]"
              label="停止位"
              prop="stop_bit"
            >
              <el-select
                class="w-[328px]"
                v-model="model.stop_bit"
                placeholder="请选择停止位"
              >
                <el-option
                  v-for="item in stop_bitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </div>

    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button
        type="primary"
        @click="confirm(ruleFormRef)"
      >确定</el-button>
    </template>
  </el-dialog>
</template>
  
<script setup lang="ts">
import type { FormInstance } from "element-plus";

import { EditChannelRuleFromRules } from "./rules";
import type { EditChannelRuleFrom } from "./rules";
import { editAcquisitionBasic, getProtocolList } from "@/api/gatewayManage";
import type {
  ProtocolInfoQuery,
  ProtocolResponse,
} from "@/api/gatewayManage/type";
import { reduce } from "lodash-es";
/*
  事件定义
  */
const emit = defineEmits(["update:modelValue", "success"]);

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
    currentNode: null,
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
const showSerial = ref<boolean>(false);
const dialogConfig = reactive({
  title: "编辑采集通道",
  width: "640px",
});

const communication_modeOptions = ref([
  {
    value: 1,
    label: "以太网",
  },
  {
    value: 2,
    label: "串口",
  },
  {
    value: 3,
    label: "无线",
  },
]);

const protocol_idOptions = ref([]);
const parity_bitOptions = ref([
  { value: 1, label: "奇" },
  { value: 2, label: "偶" },
  { value: 3, label: "无" },
  { value: 4, label: "标记" },
  { value: 5, label: "空格" },
]);
const stop_bitOptions = ref<number[]>([1, 2]);
const baud_rateOptions = ref<number[]>([
  300, 600, 1200, 2400, 4800, 9600, 19200, 38400,
]);
const data_bitOptions = ref<number[]>([5, 6, 7, 8]);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        showSerial.value = props.currentNode.communication_mode === 2;
        model.value = props.currentNode;
        model.value.baud_rate = props.currentNode.serial_params.baud_rate;
        model.value.data_bit = props.currentNode.serial_params.data_bit;
        model.value.parity_bit = props.currentNode.serial_params.parity_bit;
        model.value.stop_bit = props.currentNode.serial_params.stop_bit;

        initProtocolList();
      });
    }
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<EditChannelRuleFrom>({
  channel_name: "",
  protocol_id: undefined,
  communication_mode: undefined,
  serial_name: undefined,
  baud_rate: undefined,
  data_bit: undefined,
  parity_bit: undefined,
  stop_bit: undefined,
});

function cancel() {
  show.value = false;
}
async function initProtocolList() {
  let gateway_id = props.currentNode.gateway_id;
  let param = {
    channel_type: 1,
    communication_mode: props.currentNode.communication_mode,
  };
  const res: UniversalReponse<ProtocolResponse[]> = await getProtocolList(
    gateway_id,
    param
  );
  if (res.code === 0 && res.data?.length) {
    // 按当前通信方式过滤规约类型
    protocol_idOptions.value = res.data;
  }
}

async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  let param: ProtocolInfoQuery = {
    gateway_id: props.currentNode.gateway_id,
    channel_id: props.currentNode.channel_id,
    channel_name: model.value.channel_name,
    protocol_id: model.value.protocol_id,
    serial_params: {
      baud_rate: model.value.baud_rate,
      data_bit: model.value.data_bit,
      parity_bit: model.value.parity_bit,
      stop_bit: model.value.stop_bit,
    },
  };
  formEl.validate(async (valid) => {
    if (valid) {
      const res: UniversalReponse<null> = await editAcquisitionBasic(param);
      if (res.code === 0) {
        ElMessage.success("编辑成功");
        show.value = false;
        emit("success");
      }
    }
  });
}

onMounted(async () => {});
</script>
  <style lang="scss">
.gatewayManagement-editAcquisition {
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
  