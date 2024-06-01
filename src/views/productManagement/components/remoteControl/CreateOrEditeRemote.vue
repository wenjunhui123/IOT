<template>
  <el-dialog
    custom-class="productManagement-createOrEditeRemoteControlPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditeRemoteControlForm"
      label-position="top"
      :model="model"
      :rules="RemoteControlRuleFormRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="遥控点名称"
              prop="service_name"
            >
              <el-input
                v-model="model.service_name"
                placeholder="请输入遥控点名称"
              />
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
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="动作类型"
              prop="ipaddr1"
            >
              <el-select
                class="w-full"
                v-model="model.action_type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in remoteControlTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
  <Preferences v-model="isShowPreferences" @ok="selectDataId"></Preferences>
</template>
<script setup lang="ts">
import Preferences from "../measurePoints/Preferences.vue";
import { Link } from "@element-plus/icons-vue";
import { RemoteControlRuleFormRules } from "./rules";
import type { FormInstance } from "element-plus";
import {
  getParamster,
  createProductRemoteService,
  uptoDateProductRemoteService,
} from "@/api/productManage/index";
import type {
  ParameterProductRes,
  CreateOrEditProductRemoteQuery,
  ProductRemoteResponse,
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
    node: ProductRemoteResponse;
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
          dialogConfig.title = "编辑遥控";
          model.value = {
            service_id: props.node.service_id,
            service_name: props.node.service_name,
            action_type: props.node.action_type,
            para_handle: props.node.para_handle,
            data_id: props.node.data_id,
            data_name: props.node.data_name,
            logical_id: props.node.logical_id,
          };
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增遥控";
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const dialogConfig = reactive({
  title: "新增遥控",
  width: "640px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<CreateOrEditProductRemoteQuery>({
  service_id: 0,
  service_name: "",
  action_type: 1,
  para_handle: 0,
  data_id: undefined,
  data_name: "",
  logical_id: undefined,
});

const remoteControlTypeOption = ref<{ id: number; name: string }[]>([
  { id: 1, name: "闭合" },
  { id: 2, name: "打开" },
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
    if (RemoteControlRuleFormRules.logical_id) {
      RemoteControlRuleFormRules.logical_id[0].required = false;
    }
  } else {
    model.value.logical_id = 1;
    if (RemoteControlRuleFormRules.logical_id) {
      RemoteControlRuleFormRules.logical_id[0].required = true;
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
      if (RemoteControlRuleFormRules.logical_id) {
        RemoteControlRuleFormRules.logical_id[0].required = false;
      }
    } else {
      model.value.logical_id = 1;
      if (RemoteControlRuleFormRules.logical_id) {
        RemoteControlRuleFormRules.logical_id[0].required = true;
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
      let param: CreateOrEditProductRemoteQuery = {
        service_name: model.value.service_name,
        action_type: model.value.action_type,
        para_handle: model.value.para_handle,
        data_id: model.value.data_id,
        logical_id: model.value.logical_id,
      };
      if (props.infoType === "create") {
        const res = await createProductRemoteService(productId.value, [param]);
        if (res.code === 0) {
          emit("infoTOMain", "create");
          show.value = false;
          ElMessage.success("遥控新增成功！");
        }
      } else if (props.infoType === "edit") {
        param.service_id = model.value.service_id;
        const res = await uptoDateProductRemoteService(productId.value, param);
        if (res.code === 0) {
          emit("infoTOMain", "edit");
          show.value = false;
          ElMessage.success("遥控编辑成功！");
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
    service_id: 0,
    service_name: "",
    action_type: 1,
    para_handle: 0,
    data_id: undefined,
    data_name: "",
    logical_id: undefined,
  };
}
</script>
<style lang="scss">
.productManagement-createOrEditeRemoteControlPage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .createOrEditeRemoteControlForm {
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
      padding-left: 0px;
      padding-right: 0px;
    }
    .params-link {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
        inset;
    }
  }
}
</style>
