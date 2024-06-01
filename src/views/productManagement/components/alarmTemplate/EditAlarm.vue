<template>
  <el-dialog
    custom-class="productManagement-editeAlarmPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditeAlarmForm"
      label-position="top"
      :model="model"
      :rules="AlarmFormRules"
      ><div class="mb-[10px] flex">
        <div
          class="w-full flex flex-col px-6 py-4 bg-BG1 rounded-lg box-border h-[668px]"
        >
          <el-form-item
            class="important-h-[56px] mb-6"
            label="测量参数"
            prop="para_name"
          >
            <el-input
              :disabled="true"
              v-model="model.para_name"
              placeholder="请输入测量参数"
            />
          </el-form-item>
          <div class="flex justify-between">
            <div class="w-[calc(50%-12px)] mr-6">
              <el-form-item
                v-if="model.event_type !== 1"
                class="important-h-[56px] mb-6"
                label="告警级别"
                prop="event_level"
              >
                <el-select
                  class="w-full"
                  v-model="model.event_level"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in alarmLevelOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="上限值"
                prop="param1"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param1"
                  placeholder="请输入上限值"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3 || model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="动作延时(秒)"
                prop="action_delay"
              >
                <el-input-number
                  v-model="model.action_delay"
                  :controls="false"
                  :precision="0"
                  placeholder="请输入动作延时"
                />
              </el-form-item>
            </div>
            <div class="w-[calc(50%-12px)]">
              <el-form-item
                v-if="model.event_type === 2 || model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="动作类型"
                prop="action_type"
              >
                <el-select
                  class="w-full"
                  v-model="model.action_type"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in actionTypeOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="枚举值"
                prop="param1"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param1"
                  placeholder="请输入枚举"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="下限值"
                prop="param2"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param2"
                  placeholder="请输入下限值"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3 || model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="返回延时(秒)"
                prop="return_delay"
              >
                <el-input-number
                  :controls="false"
                  :precision="0"
                  v-model="model.return_delay"
                  placeholder="请输入返回延时"
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item
            v-if="model.event_type === 1"
            class="important-h-[56px] mb-6"
            label="告警级别"
            prop="event_level"
          >
            <el-select
              class="w-full"
              v-model="model.event_level"
              placeholder="请选择"
            >
              <el-option
                v-for="item in alarmLevelOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div class="flex-1 alarmDescription">
            <el-form-item
              class="h-full mb-4"
              label="告警描述"
              prop="event_desc"
            >
              <template #label
                ><span>告警描述</span>
                <el-tooltip effect="dark" placement="right">
                  <i class="el-icon-question"></i>
                  <template #content>
                    <i class="el-icon-question"></i>告警描述说明<br />
                    厂站名称：%StationName% <br />
                    通道名称：%ChannelName%<br />
                    设备名称：%DeviceName%<br />
                    测点名称：%MeasureName%<br />
                    越限类型：%ACTType%<br />
                    告警类型：%WSPType% <br />告警特征值：%WSPValue%
                  </template>
                </el-tooltip>
              </template>
              <el-input
                class="h-full"
                resize="none"
                v-model="model.event_desc"
                type="textarea"
                placeholder="请输入告警描述"
              />
            </el-form-item>
          </div>
        </div>
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
import { AlarmFormRules } from "./rules";
import type { AlarmClassfication, AlarmForm } from "./rules";
import { uptoDateProductAlarm } from "@/api/productManage/index";
import type {
  ProductAlarmResponse,
  CreateOrEditProductAlarmQuery,
} from "@/api/productManage/types";
import { cloneDeep } from "lodash-es";

const productId: any = inject<number>("productId");
const currentTemplate: any = inject("currentTemplate");

watch(
  () => [productId.value, props.modelValue],
  ([val1, val2]) => {
    if (val1 && val2) {
      nextTick(() => {
        formatterData();
      });
    }
  },
  { immediate: true, deep: true }
);

/*
  事件定义
  */
const emit = defineEmits(["update:modelValue", "infoTOMain"]);

/*
  弹窗显隐控制及弹窗
  */
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    chooseItem: ProductAlarmResponse | undefined;
  }>(),
  {
    modelValue: false,
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
  title: "编辑告警点(开关量变位）",
  width: "480px",
});

const alarmLevelOption = ref<AlarmClassfication[]>([
  {
    id: 2,
    name: "事故",
  },
  {
    id: 3,
    name: "报警",
  },
  {
    id: 4,
    name: "一般",
  },
  {
    id: 1,
    name: "其它",
  },
  {
    id: 5,
    name: "预警",
  },
]);
const actionTypeOption = ref<AlarmClassfication[]>([
  {
    id: 2,
    name: "打开",
  },
  {
    id: 1,
    name: "闭合",
  },
]);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<AlarmForm>({
  para_name: "",
  event_id: 0,
  event_type: 1,
  event_level: 1,
  action_type: 1,
  param1: 0,
  param2: 1,
  action_delay: 0,
  return_delay: 0,
  event_desc: "",
  para: [],
  need_save: true,
});

watch(
  () => model.value.event_type,
  (val) => {
    if (val === 2) {
      actionTypeOption.value = [
        {
          id: 2,
          name: "打开",
        },
        {
          id: 1,
          name: "闭合",
        },
      ];
    } else if (val === 3) {
      actionTypeOption.value = [
        {
          id: 1,
          name: "越上限",
        },
        {
          id: 2,
          name: "越下限",
        },
      ];
    }
  },
  { deep: true, immediate: true }
);

function formatterData() {
  if (props.chooseItem?.event_type === 2) {
    dialogConfig.title = "编辑告警点(开关量变位）";
  } else if (props.chooseItem?.event_type === 1) {
    dialogConfig.title = "编辑告警点(设备定值越限）";
  } else if (props.chooseItem?.event_type === 3) {
    dialogConfig.title = "编辑告警点(上位机模拟量越限）";
  } else if (props.chooseItem?.event_type === 5) {
    dialogConfig.title = "编辑告警点(模拟量枚举值越限）";
  }
  if (props.chooseItem) {
    model.value = {
      para_name: props.chooseItem?.para_name,
      event_id: props.chooseItem?.event_id,
      //   event_type: props.chooseItem?.event_type,
      event_level: props.chooseItem?.event_level,
      action_type: props.chooseItem?.action_type,
      param1: props.chooseItem?.param1,
      param2: props.chooseItem?.param2,
      action_delay: props.chooseItem?.action_delay,
      return_delay: props.chooseItem?.return_delay,
      event_desc: props.chooseItem?.event_desc,
      //   para: props.chooseItem?.para,
      need_save: true,
    };
  }
  if (!model.value.para_name) {
    ElMessage.warning("该测点已删除");
  }
}

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let param: CreateOrEditProductAlarmQuery = cloneDeep(model.value);
      if (model.value.event_type === 2) {
        delete param.param2;
      } else if (model.value.event_type === 1 || model.value.event_type === 5) {
        delete param.param2;
        delete param.action_type;
      }
      const res: UniversalReponse<object> = await uptoDateProductAlarm(
        productId.value,
        currentTemplate.value.id as number,
        param
      );
      if (res.code === 0) {
        show.value = false;
        ElMessage.success("编辑告警点成功！");
        emit("infoTOMain", "editAlarm");
      }
    }
  });
}
function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-editeAlarmPage {
  margin-top: 6vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .createOrEditeAlarmForm {
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
      .el-input-number {
        width: 100%;
      }
      .el-input-number.is-without-controls .el-input__wrapper {
        width: 100% !important;
        padding-left: 0px;
        padding-right: 0px;
      }
    }
    .el-transfer__buttons {
      padding: 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .el-transfer__button:nth-child(2) {
        margin-left: 0;
      }
    }
    .el-transfer-panel__body {
      height: calc(100% - 55px);
      padding-bottom: 15px;
      .el-transfer-panel__filter {
        padding: 0;
        width: calc(100% - 30px);
      }
    }
    .alarmDescription {
      .el-form-item__content {
        height: calc(100% - 28px);
      }
    }
  }
}
</style>
