<template>
  <el-dialog
    custom-class="productManagement-editTemplatePage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG editTemplateForm"
      label-position="top"
      :model="model"
      :rules="AlarmTemplateFormRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg mb-[10px]">
        <el-form-item
          class="important-h-[54px]"
          label="告警模板名称"
          prop="name"
        >
          <el-input v-model="model.name" placeholder="请输入告警模板名称" />
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
import { AlarmTemplateFormRules } from "./rules";
import type { AlarmTemplate } from "./rules";
import type { FormInstance } from "element-plus";
import { uptoDateProductAlarmTemplate } from "@/api/productManage/index";
import type {
  CreateOrEditProductAlarmTemplateQuery,
  ProductAlarmTemplateResponse,
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
    alarmTemplate: AlarmTemplate;
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

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        if (props.alarmTemplate?.id) {
          for (let key in props.alarmTemplate) {
            model[key] = props.alarmTemplate[key];
          }
        }
      });
    }
  }
);

const dialogConfig = reactive({
  title: "编辑模板",
  width: "480px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = reactive<AlarmTemplate>({
  id: 0,
  name: "",
  isChecked: false,
});

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const res = await uptoDateProductAlarmTemplate(productId.value, {
        strategy_id: model.id,
        strategy_name: model.name,
      });
      if (res.code === 0) {
        ElMessage.success("编辑模板成功！");
        show.value = false;
        emit("infoTOMain", "editTemplate");
      }
    }
  });
}
function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-editTemplatePage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .editTemplateForm {
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
