<template>
  <el-dialog
    custom-class="productManagement-customProductsPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-form
      ref="ruleFormRef"
      class="bg-BG customProductsForm"
      label-position="top"
      :model="model"
      :rules="CustomProductsFormRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="产品名称"
              prop="product_name"
            >
              <el-input
                v-model="model.product_name"
                placeholder="请输入产品名称"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="驱动类型"
              prop="driver_type"
            >
              <el-select
                class="w-full"
                v-model="model.driver_type"
                placeholder="请选择"
                :disabled="is_release"
              >
                <el-option
                  v-for="item in driver_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="产品类型"
              prop="product_type"
            >
              <el-select
                class="w-full"
                v-model="model.product_type"
                placeholder="请选择"
                :disabled="is_release"
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
              class="important-h-[64px]"
              label="设备类型"
              prop="device_type"
            >
              <el-select
                class="w-full"
                v-model="model.device_type"
                placeholder="请选择"
                :disabled="is_release"
              >
                <el-option
                  v-for="item in device_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="产品描述" prop="description">
          <el-input
            class="h-[160px]"
            resize="none"
            type="textarea"
            :autosize="true"
            v-model="model.description"
            placeholder="请输入产品描述"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { CustomProductsFormRules } from "./rules";
import type { CustomProductsRuleForm } from "./rules";
import { createProduct, editProduct } from "@/api/productManage/index";
import type { MainProductData } from "@/api/productManage/types";
import type { FormInstance } from "element-plus";
import {
  getAllDrvtypes,
  getAllDevicetypes,
} from "@/api/channelManagement/index";
import type { Drvtypes } from "@/api/channelManagement/type";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue", "ok"]);

/*
弹窗显隐控制及弹窗
*/
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    infoType: string;
    node: MainProductData;
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
          dialogConfig.title = "编辑自定义产品";
          model.value = {
            product_name: props.node.product_name,
            description: props.node.description,
            product_id: props.node.product_id,
            product_type: props.node.product_type,
            driver_type: props.node.driver_type,
            device_type: props.node.device_type,
          };
          is_release.value = props.node.is_release;
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增自定义产品";
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const dialogConfig = reactive({
  title: "新增自定义产品",
  width: "640px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<CustomProductsRuleForm>({
  product_name: "",
  description: "",
  product_id: 0,
  product_type: undefined,
  driver_type: undefined,
  device_type: undefined,
});
const is_release = ref<boolean>(false);

const product_type_options = ref<{ id: number; name: string }[]>([
  { id: 1, name: "直采" },
  { id: 2, name: "网关子设备" },
]);
const device_type_options = ref<{ id: number; name: string }[]>([]);
const driver_type_options = ref<{ id: number; name: string }[]>([]);

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const params: CustomProductsRuleForm = {
        product_name: model.value.product_name,
        description: model.value.description,
        product_type: model.value.product_type,
        driver_type: model.value.driver_type,
        device_type: model.value.device_type,
      };
      if (props.infoType === "create") {
        const res = await createProduct(params);
        if (res.code === 0) {
          show.value = false;
          ElMessage.success("产品新增成功！");
          emit("ok");
        }
      } else if (props.infoType === "edit") {
        if (props.node.is_release) {
          delete params.product_type;
          delete params.driver_type;
          delete params.device_type;
        }
        const res = await editProduct(props.node.product_id, params);
        if (res.code === 0) {
          show.value = false;
          ElMessage.success("产品编辑成功！");
          emit("ok", true);
        }
      }
    }
  });
}
function cancel() {
  show.value = false;
}

function emptyData(formEl: FormInstance | undefined) {
  getAllTypesDate();
  formEl?.clearValidate();
  model.value = {
    product_name: "",
    description: "",
    product_id: 0,
    product_type: undefined,
    driver_type: undefined,
    device_type: undefined,
  };
  is_release.value = false;
}

async function getAllTypesDate() {
  device_type_options.value = [];
  driver_type_options.value = [];
  const resDevice: UniversalReponse<Drvtypes[]> = await getAllDevicetypes();
  if (resDevice.code === 0 && resDevice.data?.length) {
    resDevice.data.forEach((item) => {
      const param = {
        id: item.nodeId,
        name: item.nodeName,
      };
      device_type_options.value.push(param);
    });
  }
  const resDrver: UniversalReponse<Drvtypes[]> = await getAllDrvtypes();
  if (resDrver.code === 0 && resDrver.data?.length) {
    resDrver.data.forEach((item) => {
      const param = {
        id: item.nodeId,
        name: item.nodeName,
      };
      driver_type_options.value.push(param);
    });
  }
}
onMounted(() => {
  //   getAllTypesDate();
});
</script>
<style lang="scss">
.productManagement-customProductsPage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .customProductsForm {
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
  }
}
</style>
