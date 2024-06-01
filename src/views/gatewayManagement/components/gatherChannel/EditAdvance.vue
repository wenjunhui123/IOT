<template>
  <el-dialog
    class="gatewayManagement-editAcquisitionAdvance important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditDeviceForm"
      label-position="top"
      :model="model"
      :rules="EditAdvancedParamRuleFromRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg advanced">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-w-[236px] important-h-[64px] important-flex-auto"
              label="设备切换时间"
              prop="device_switch_time"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.device_switch_time"
                :controls="false"
                :min="0"
                :max="60000"
                :pricision="0"
              />
              <span class="unit">min</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="字节间隔"
              prop="byte_interval"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.byte_interval"
                :controls="false"
                :min="0"
                :max="60000"
                :pricision="0"
              /><span class="unit">ms</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="系统时间间隔"
              prop="sys_time_cycle"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.sys_time_cycle"
                :controls="false"
                :min="0"
                :max="60000"
                :pricision="0"
              /><span class="unit">s</span>
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="重连等待时间"
              prop="wait_reconnect_time"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.wait_reconnect_time"
                :controls="false"
                :min="0"
                :max="60"
                :pricision="0"
              /><span class="unit">min</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="备注"
              prop="advanced_remark"
            >
              <el-input
                v-model="model.advanced_remark"
                maxlength="31"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="首字节等待时间"
              prop="first_byte_wait_time"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.first_byte_wait_time"
                :controls="false"
                :min="0"
                :max="60000"
                :pricision="0"
              ></el-input-number
              ><span class="unit">ms</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="发送等待时间"
              prop="send_wait_time"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.send_wait_time"
                :controls="false"
                :min="0"
                :max="60000"
                :pricision="0"
              ></el-input-number
              ><span class="unit">ms</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="采集周期"
              prop="sample_cycle"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.sample_cycle"
                :min="0"
                :max="60000"
                :controls="false"
              ></el-input-number
              ><span class="unit">s</span>
            </el-form-item>
            <el-form-item
              class="important-w-[236px] important-h-[64px]"
              label="出错重试次数"
              prop="err_count"
            >
              <el-input-number
                class="important-w-[192px]"
                v-model="model.err_count"
                :controls="false"
                :min="0"
                :max="60"
                :pricision="0"
              ></el-input-number
              ><span class="unit">次</span>
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

import { EditAdvancedParamRuleFromRules } from "./rules";
import type { AdvancedParam } from "./rules";
import {
  queryAcquisitionAdvanced,
  editAcquisitionAdvanced,
} from "@/api/gatewayManage";
import type { AcquisitionAdvancedQueryOrResponse } from "@/api/gatewayManage/types";

/*
  事件定义
*/
const emit = defineEmits(["update:modelValue"]);

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
const dialogConfig = reactive({
  title: "编辑高级参数",
  width: "640px",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        emptyData();
        initData();
      });
    }
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<AdvancedParam>({
  device_switch_time: 0,
  first_byte_wait_time: 0,
  byte_interval: 0,
  send_wait_time: 0,
  sys_time_cycle: 0,
  sample_cycle: 0,
  wait_reconnect_time: 0,
  err_count: 0,
  advanced_remark: "",
});

function cancel() {
  show.value = false;
}

async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;

  formEl.validate(async (valid) => {
    if (valid) {
      const res: UniversalReponse<null> = await editAcquisitionAdvanced(
        model.value,
        props.currentNode.gateway_id,
        props.currentNode.channel_id
      );
      if (res.code === 0) {
        ElMessage.success("编辑成功");
        show.value = false;
      }
    }
  });
}
function emptyData() {
  model.value.device_switch_time = 0;
  model.value.first_byte_wait_time = 0;
  model.value.byte_interval = 0;
  model.value.send_wait_time = 0;
  model.value.sys_time_cycle = 0;
  model.value.sample_cycle = 0;
  model.value.wait_reconnect_time = 0;
  model.value.err_count = 0;
  model.value.advanced_remark = "";
}
async function initData() {
  const res: UniversalReponse<AcquisitionAdvancedQueryOrResponse> =
    await queryAcquisitionAdvanced(
      props.currentNode.gateway_id,
      props.currentNode.channel_id
    );
  if (res.code === 0 && res.data) {
    model.value = res.data;
  }
}

onMounted(async () => {});
</script>
<style lang="scss">
.gatewayManagement-editAcquisitionAdvance {
  margin-top: 6vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
}
.createOrEditDeviceForm {
  :deep(.el-input__wrapper) {
    width: 236px !important;
    border: 1px solid;
    border-right: 0 !important;
    @include border_color(B1);
    border-radius: 4px 0px 0px 4px;
    box-shadow: unset;
  }

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
</style>

<style scoped>
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
