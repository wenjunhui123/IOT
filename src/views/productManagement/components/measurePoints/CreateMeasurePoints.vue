<template>
  <el-dialog
    custom-class="productManagement-createMeasurePointsPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG createMeasurePointsForm"
      label-position="top"
      :model="model"
      :rules="MeasurePointsRuleFormRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="测点类型"
              prop="ipaddr1"
            >
              <el-select
                class="w-full"
                v-model="model.property_type"
                placeholder="请选择"
                :disabled="infoType === 'edit'"
              >
                <el-option
                  v-for="item in measurePointsTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="参数号"
              prop="para_handle"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                :min="-999999999"
                :max="999999999"
                v-model="model.para_handle"
                placeholder="请输入参数号"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="参数名称"
              prop="data_name"
            >
              <el-select
                class="important-w-[236px] mr-2"
                v-model="model.data_name"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入参数名称"
                :remote-method="remoteParamsterMethod"
                @change="changeDataId"
              >
                <el-option
                  v-for="item in paramsterOptions"
                  :key="item.data_id"
                  :label="item.data_name"
                  :value="item.data_id"
                />
              </el-select>
              <Link
                class="params-link cursor-pointer w-[32px] h-[32px] p-[6px] rounded-[4px]"
                @click="selectParams"
              ></Link>
            </el-form-item>
            <el-form-item
              v-if="model.property_type === 1"
              class="important-h-[64px]"
              label="取值范围"
              required
              ><el-form-item prop="property_option.min" required
                ><el-input-number
                  class="important-w-[128px] mr-2"
                  :min="-999999999"
                  :max="999999999"
                  v-model="model.property_option.min"
                  :controls="false"
              /></el-form-item>

              <div class="box-border h-8 leading-8 pb-12">-</div>
              <el-form-item prop="property_option.max" required>
                <el-input-number
                  class="important-w-[128px] ml-2"
                  :min="-999999999"
                  :max="999999999"
                  v-model="model.property_option.max"
                  :controls="false"
              /></el-form-item>
            </el-form-item>

            <el-form-item
              v-if="model.property_type === 2"
              class="reverseSwitch important-h-[20px] important-flex important-w-[120px]"
              label="反转开关"
              prop="reverse"
              ><el-switch
                class="w-[100px] ml-2"
                v-model="model.property_option.reverse"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="测点名称"
              prop="property_name"
            >
              <el-input
                v-model="model.property_name"
                placeholder="请输入测点名称"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="回路号"
              prop="logical_id"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                :min="-999999999"
                :max="999999999"
                :disabled="model.data_id ? false : true"
                v-model="model.logical_id"
                placeholder="请输入回路号"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="参数ID"
              prop="data_id"
            >
              <el-input
                :disabled="true"
                v-model="model.data_id"
                placeholder="请输入参数ID"
              />
            </el-form-item>
            <el-form-item
              v-if="false"
              class="important-h-[64px]"
              label="缩放系数"
              prop="scaling_factor"
            >
              <el-input-number
                class="important-w-full"
                :controls="false"
                v-model="model.property_option.scaling_factor"
                placeholder="请输入缩放系数"
                :min="0"
              />
            </el-form-item>
            <el-form-item
              v-if="model.property_type === 1"
              class="important-h-[64px]"
              label="单位"
              prop="unit"
            >
              <el-select
                class="w-full"
                v-model="model.property_option.unit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in unitOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
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
  <Preferences
    v-model="isShowPreferences"
    :measureType="model.property_type"
    @ok="selectDataId"
  ></Preferences>
</template>
<script setup lang="ts">
import Preferences from "./Preferences.vue";
import { Link } from "@element-plus/icons-vue";
import { MeasurePointsRuleFormRules } from "./rules";
import type { FormInstance } from "element-plus";
import {
  getParamster,
  createProductProperty,
  uptoDateProductProperty,
} from "@/api/productManage/index";
import type {
  CreateOrEditProductPropertyQuery,
  ParameterProductRes,
  ProductPropertyResponse,
} from "@/api/productManage/types";

const productId: any = inject<number>("productId");

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
    infoType: string;
    node: ProductPropertyResponse;
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

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        emptyData(ruleFormRef.value);
        if (props.infoType === "edit") {
          dialogConfig.title = "编辑测点";
          nextTick(() => {
            model.value = {
              property_id: props.node.property_id,
              property_name: props.node.property_name,
              property_type: props.node.property_type,
              para_handle: props.node.para_handle,
              data_id: props.node.data_id,
              data_name: props.node.data_name,
              logical_id: props.node.logical_id,
              property_option: {
                min:
                  props.node.property_option.min ||
                  props.node.property_option.min === 0
                    ? props.node.property_option.min
                    : 0,
                max:
                  props.node.property_option.max ||
                  props.node.property_option.max === 0
                    ? props.node.property_option.max
                    : 1,
                reverse: props.node.property_option.reverse
                  ? props.node.property_option.reverse
                  : false,
                scaling_factor:
                  props.node.property_option.scaling_factor ||
                  props.node.property_option.scaling_factor === 0
                    ? props.node.property_option.scaling_factor
                    : 1,
                unit: props.node.property_option.unit
                  ? props.node.property_option.unit
                  : "",
              },
            };
          });
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增测点";
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const dialogConfig = reactive({
  title: "新建测点",
  width: "640px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<CreateOrEditProductPropertyQuery>({
  property_id: 0,
  property_name: "",
  property_type: 1,
  para_handle: 0,
  data_id: undefined,
  data_name: "",
  logical_id: undefined,
  property_option: {
    min: -999999999,
    max: 999999999,
    reverse: false,
    scaling_factor: 1,
    unit: "",
  },
});

const measurePointsTypeOption = ref<{ id: number; name: string }[]>([
  { id: 1, name: "模拟量" },
  { id: 2, name: "开关量" },
]);
const unitOption = ref<{ id: number; name: string }[]>([
  { id: 1, name: "kA" },
  { id: 2, name: "kV" },
]);

const paramsterOptions = ref<{ data_id: number; data_name: string }[]>([]);
function selectParams() {
  isShowPreferences.value = true;
}
async function remoteParamsterMethod(query: string) {
  if (query) {
    const res: UniversalReponse<ParameterProductRes[]> =
      await getParamster(query);
    if (res.code === 0 && res.data.length) {
      paramsterOptions.value = res.data;
    }
  } else {
    paramsterOptions.value = [];
  }
}
function changeDataId(val: number) {
  if (!val) {
    model.value.data_id = undefined;
    model.value.logical_id = undefined;
    if (MeasurePointsRuleFormRules.logical_id) {
      MeasurePointsRuleFormRules.logical_id[0].required = false;
    }
  } else {
    model.value.logical_id = 1;
    if (MeasurePointsRuleFormRules.logical_id) {
      MeasurePointsRuleFormRules.logical_id[0].required = true;
    }
  }
  paramsterOptions.value.forEach((item) => {
    if (item.data_id === val) {
      model.value.data_id = val;
    }
  });
}
function selectDataId(node: { data_id: number; data_name: string }) {
  if (node.data_id && node.data_name) {
    model.value.data_id = node.data_id;
    model.value.data_name = node.data_name;
    if (!node.data_id) {
      model.value.data_id = undefined;
      model.value.logical_id = undefined;
      if (MeasurePointsRuleFormRules.logical_id) {
        MeasurePointsRuleFormRules.logical_id[0].required = false;
      }
    } else {
      model.value.logical_id = 1;
      if (MeasurePointsRuleFormRules.logical_id) {
        MeasurePointsRuleFormRules.logical_id[0].required = true;
      }
    }
  }
}

const isShowPreferences = ref<boolean>(false);

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      if (
        model.value.property_type === 1 &&
        model.value.property_option.max &&
        model.value.property_option.min
      ) {
        if (
          model.value.property_option.max <= model.value.property_option.min
        ) {
          return ElMessage.warning("最小值不可大于等于最大值！");
        }
      }
      if (props.infoType === "create") {
        let param: CreateOrEditProductPropertyQuery = {
          property_name: model.value.property_name,
          property_type: model.value.property_type,
          para_handle: model.value.para_handle,
          data_id: model.value.data_id,
          logical_id: model.value.logical_id,
          property_option: {
            min: -999999999,
            max: 999999999,
            reverse: false,
            scaling_factor: 1,
            unit: "",
          },
        };
        if (model.value.property_type === 2) {
          param.property_option = {
            reverse: model.value.property_option.reverse,
          };
        } else {
          param.property_option = {
            min: model.value.property_option.min,
            max: model.value.property_option.max,
            unit: model.value.property_option.unit,
          };
        }
        const res = await createProductProperty(productId.value, [param]);
        if (res.code === 0) {
          emit("infoTOMain");
          show.value = false;
          ElMessage.success("测点新增成功！");
        }
      } else if (props.infoType === "edit") {
        let param: CreateOrEditProductPropertyQuery = {
          property_id: model.value.property_id,
          property_name: model.value.property_name,
          property_type: model.value.property_type,
          para_handle: model.value.para_handle,
          data_id: model.value.data_id,
          logical_id: model.value.logical_id,
          property_option: {
            min: -999999999,
            max: 999999999,
            reverse: false,
            scaling_factor: 1,
            unit: "",
          },
        };
        if (model.value.property_type === 2) {
          param.property_option = {
            reverse: model.value.property_option.reverse,
          };
        } else {
          param.property_option = {
            min: model.value.property_option.min,
            max: model.value.property_option.max,
            unit: model.value.property_option.unit,
          };
        }
        const res = await uptoDateProductProperty(productId.value, param);
        if (res.code === 0) {
          emit("infoTOMain");
          show.value = false;
          ElMessage.success("测点编辑成功！");
        }
      }
    }
  });
}
function cancel() {
  show.value = false;
}

function emptyData(formEl: FormInstance | undefined) {
  formEl?.clearValidate();
  model.value = {
    property_id: 0,
    property_name: "",
    property_type: 1,
    para_handle: 0,
    data_id: undefined,
    data_name: "",
    logical_id: undefined,
    property_option: {
      min: -999999999,
      max: 999999999,
      reverse: false,
      scaling_factor: 1,
      unit: "",
    },
  };
}
</script>
<style lang="scss">
.productManagement-createMeasurePointsPage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .createMeasurePointsForm {
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
    .reverseSwitch {
      .el-form-item__label {
        margin-top: 2px;
      }
    }
    .el-input-number.is-without-controls .el-input__wrapper {
      width: 100% !important;
      padding-left: 0;
      padding-right: 0;
    }
    .params-link {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
        inset;
    }
  }
}
</style>
