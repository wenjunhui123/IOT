<template>
  <el-dialog
    custom-class="productManagement-importProductsPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-form
      ref="ruleFormRef"
      class="bg-BG importProductsForm"
      label-position="top"
      :model="model"
      :rules="ImportProductsFormRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-row :gutter="20"
          ><el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="导入来源"
              prop="product_src"
            >
              <el-select
                class="w-full"
                v-model="model.product_src"
                placeholder="请选择"
                @change="changeImportSource"
              >
                <el-option
                  v-for="item in importSourceOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="model.product_src === 1"
              class="important-h-[64px]"
              label="选择其他产品"
              prop="ipaddr1"
            >
              <el-select
                class="w-full"
                v-model="model.other_product_type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in other_product_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="model.product_src !== 1"
              class="important-h-[64px]"
              label="产品名称"
              prop="product_name"
            >
              <el-input
                v-model="model.product_name"
                placeholder="请输入产品名称"
              />
            </el-form-item> </el-col
        ></el-row>
        <el-form-item
          v-if="model.product_src === 1"
          class="important-h-[64px]"
          label="产品名称"
          prop="product_name"
        >
          <el-input v-model="model.product_name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item class="h-full mb-4" label="产品描述" prop="description">
          <el-input
            class="important-h-[152px]"
            resize="none"
            v-model="model.description"
            type="textarea"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        <el-upload
          v-if="model.product_src === 2"
          ref="refUploadDriFile"
          class="important-w-full important-h-[149px]"
          drag
          action=""
          accept=".dri"
          :on-change="uploadChange"
          :on-exceed="handleExceed"
          :before-remove="fileRemove"
          :auto-upload="false"
          :multiple="false"
          :limit="1"
        >
          <el-icon class="el-icon--upload important-mb-0"
            ><upload-filled
          /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或 <em>点击上传</em>
          </div>

          <template #tip>
            <!-- <div class="el-upload__tip">只能上传XX文件，且不超过500kb</div> -->
          </template>
        </el-upload>
        <el-row v-if="model.product_src === 3" :gutter="20">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="驱动类型"
              prop="driver_type"
            >
              <el-select
                class="w-full"
                v-model="model.driver_type"
                placeholder="请选择驱动类型"
              >
                <el-option
                  v-for="item in driver_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="数据映射方案"
              prop="datarecmap_id"
            >
              <el-select
                class="w-full"
                v-model="model.datarecmap_id"
                placeholder="请选择数据映射方案"
              >
                <el-option
                  v-for="item in datarecmap_options"
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
              label="设备类型"
              prop="device_type"
            >
              <el-select
                class="w-full"
                v-model="model.device_type"
                placeholder="请选择设备类型"
                @change="changeDeviceType"
              >
                <el-option
                  v-for="item in device_type_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="参数映射方案"
              prop="ipaddr1"
            >
              <el-select
                class="w-full"
                v-model="model.parasetmap_id"
                placeholder="请选择参数映射方案"
              >
                <el-option
                  v-for="item in parasetmap_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-upload
            ref="refUploadSnfFile"
            class="important-w-full important-h-[149px]"
            drag
            action=""
            accept=".snf"
            :on-change="uploadChange"
            :on-exceed="handleExceed"
            :before-remove="fileRemove"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
          >
            <el-icon class="el-icon--upload important-mb-0"
              ><upload-filled
            /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>

            <template #tip>
              <!-- <div class="el-upload__tip">只能上传XX文件，且不超过500kb</div> -->
            </template>
          </el-upload>
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
import { Message, UploadFilled } from "@element-plus/icons-vue";
import { ImportProductsFormRules } from "./rules";
import type { ImportProductsForm } from "./rules";
import { genFileId } from "element-plus";
import type {
  FormInstance,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from "element-plus";
import {
  getAllDrvtypes,
  getAllDevicetypes,
} from "@/api/channelManagement/index";
import type { Drvtypes } from "@/api/channelManagement/type";
import {
  getDataLogSolutionMap,
  importDri,
  importDriver,
} from "@/api/productManage/index";
import type { DataLogSolutionMapResponse } from "@/api/productManage/types";
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
          dialogConfig.title = "编辑导入产品";
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增导入产品";
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const dialogConfig = reactive({
  title: "导入产品",
  width: "640px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<ImportProductsForm>({
  product_id: 0,
  product_name: "",
  product_src: 2,
  device_type: undefined,
  description: "",
  datarecmap_id: undefined,
  parasetmap_id: undefined,
});

const importSourceOptions = ref<{ id: number; name: string }[]>([
  //   { id: 1, name: "基于其他产品创建" },
  { id: 2, name: "导入文件" },
  { id: 3, name: "设备驱动安装包" },
]);
function changeImportSource(val: number) {
  emptyData(ruleFormRef.value);
  model.value.product_src = val;
}

// function downloadTemplate() {}

const device_type_options = ref<{ id: number; name: string }[]>([]);
async function changeDeviceType(val: number) {
  datarecmap_options.value = [];
  model.value.datarecmap_id = undefined;
  if (val) {
    const resDatarecmap: UniversalReponse<DataLogSolutionMapResponse[]> =
      await getDataLogSolutionMap(val);
    if (resDatarecmap.code === 0 && resDatarecmap.data?.length) {
      resDatarecmap.data.forEach((item) => {
        const param = {
          id: item.data_log_map_id,
          name: item.data_log_map_name,
        };
        datarecmap_options.value.push(param);
      });
    }
  }
}

const driver_type_options = ref<{ id: number; name: string }[]>([]);
const datarecmap_options = ref<{ id: number; name: string }[]>([]);
const parasetmap_options = ref<{ id: number; name: string }[]>([]);
const other_product_type_options = ref<{ id: number; name: string }[]>([]);

const refUploadDriFile = ref<UploadInstance>();
const refUploadSnfFile = ref<UploadInstance>();
const uploadFile = ref<any>();
function uploadChange(file: UploadFile, fileList: UploadFiles) {
  uploadFile.value = file;
}
const handleExceed: UploadProps["onExceed"] = (files) => {
  if (model.value.product_src === 2) {
    refUploadDriFile.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    refUploadDriFile.value!.handleStart(file);
  } else if (model.value.product_src === 3) {
    refUploadSnfFile.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    refUploadSnfFile.value!.handleStart(file);
  }
};
function fileRemove() {
  uploadFile.value = undefined;
  return true;
}

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      if (model.value.product_src === 2 && !uploadFile.value) {
        return ElMessage.warning("请上传dir文件！");
      }
      if (model.value.product_src === 2) {
        let param = {
          product_name: model.value.product_name,
          description: model.value.description as string,
          dri: uploadFile.value.raw,
        };
        const formData = new FormData();
        for (let key in param) {
          formData.append(key, param[key]);
        }
        const res = await importDri(param);
        if (res.code === 0) {
          show.value = false;
          ElMessage.success("产品编辑成功！");
          emit("ok", true);
        }
      } else if (model.value.product_src === 3) {
        let param = {
          product_name: model.value.product_name,
          description: model.value.description as string,
          driver_type: model.value.driver_type as number,
          device_type: model.value.device_type as number,
          datarecmap_id: model.value.datarecmap_id as number,
          parasetmap_id: model.value.parasetmap_id as number,
          snf: uploadFile.value.raw,
        };
        const res = await importDriver(param);
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
  if (model.value.product_src === 3) {
    getAllTypesDate();
  }

  formEl?.clearValidate();
  model.value = {
    product_id: 0,
    product_name: "",
    product_src: 2,
    device_type: undefined,
    description: "",
    datarecmap_id: undefined,
    parasetmap_id: undefined,
  };
  uploadFile.value = undefined;
  nextTick(() => {
    refUploadDriFile.value!.clearFiles();
    refUploadSnfFile.value!.clearFiles();
  });
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
</script>
<style lang="scss">
.productManagement-importProductsPage {
  margin-top: 10vh !important;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .importProductsForm {
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
    .el-upload-dragger {
      width: 100%;
      height: 120px;
      padding: 10px;
    }
  }
}
</style>
