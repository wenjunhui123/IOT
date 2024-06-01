<template>
  <el-dialog
    class="factoryAndStationManagement-createOrEditPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-form
      ref="ruleFormRef"
      class="bg-BG rounded-lg createOrEditForm"
      label-position="top"
      :model="model"
      :rules="createOrEditFormRules"
    >
      <el-form-item
        class="important-h-[100px]"
        label="厂站名称"
        prop="nodeName"
      >
        <el-input v-model="model.nodeName" placeholder="请输入厂站名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { DialogModel } from "./rules";
import { createOrEditFormRules } from "./rules";
import type { FormInstance } from "element-plus";
import {
  createStation,
  editStation,
  getNetworkNode,
} from "@/api/stationnodes/index";
import type { NodeStation } from "@/api/stationnodes/types";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue", "ok"]);

interface CurrentNode {
  nodeId: number;
  nodeName: string;
}

/*
弹窗显隐控制及弹窗
*/
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    isEdit: boolean;
    currentNode: CurrentNode;
  }>(),
  {
    modelValue: false,
    isEdit: false,
    currentNode: () => {
      return { nodeId: 0, nodeName: "" };
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

const dialogConfig = reactive({
  title: "新建厂站",
  width: "640px",
});

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = reactive<DialogModel>({
  nodeName: "",
  nodeId: 0,
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(async () => {
        emptyData(ruleFormRef.value);
        if (!props.isEdit) {
          dialogConfig.title = "新建厂站";
        } else if (props.isEdit) {
          dialogConfig.title = "编辑厂站";
          const res: UniversalReponse<NodeStation[]> = await getNetworkNode(
            props.currentNode.nodeId
          );
          if (res.code === 0 && res.data?.length) {
            model.nodeName = res.data[0].nodeName;
            model.nodeId = res.data[0].nodeId;
          } else {
            model.nodeName = props.currentNode.nodeName;
            model.nodeId = props.currentNode.nodeId;
          }
        }
      });
    }
  },
  {
    immediate: true,
  }
);

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      if (props.isEdit) {
        const res = await editStation(model);
        if (res.code === 0) {
          ElMessage.success("编辑成功");
          show.value = false;
          emit("ok");
        }
      } else {
        const res = await createStation(model.nodeName);
        if (res.code === 0) {
          ElMessage.success("新增成功");
          emit("ok");
          show.value = false;
        }
      }
    }
  });
}
function cancel() {
  show.value = false;
}

// 表单清空
function emptyData(formEl: FormInstance | undefined) {
  formEl?.clearValidate();
  model.nodeName = "";
  if (model.nodeId) {
    model.nodeId = 0;
  }
}
</script>

<style lang="scss">
.factoryAndStationManagement-createOrEditPage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }

  .createOrEditForm {
    .el-form-item {
      border-radius: 8px;
      padding: 24px !important;
      @include background_color("BG1");
      margin-bottom: 0px;

      .el-form-item__label {
        @include font_color("T1");
        padding: 0 !important;
        line-height: 20px !important;
      }
    }
  }
}
</style>
