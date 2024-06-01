<template>
  <el-dialog
    custom-class="productManagement-releaseConfirmationPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><div class="bg-BG px-6 py-6 bg-BG1 rounded-lg">
      <div class="flex">
        <img
          class="w-[40px] h-[40px] mr-4"
          src="../assets/release-confirmation.svg"
          alt="发布"
          title="发布"
        />
        <div>
          <div>确定要发布该产品“{{ props.node.product_name }}”吗?</div>
          <div class="mt-2 text-T4">该产品一经发布上线不可撤回</div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElLoading } from "element-plus";
import { getProductRelease } from "@/api/productManage/index";
import type { ProductDataInfo } from "@/api/productManage/types";
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
    node: ProductDataInfo;
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
  title: "发布确认",
  width: "480px",
});

async function confirm() {
  const loading = ElLoading.service({
    lock: true,
    text: "请求中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  const resRelease: UniversalReponse<{}> = await getProductRelease(
    props.node.product_id
  );
  if (resRelease.code === 0) {
    emit("ok", false, true);
    ElMessage.success("产品发布成功！");
    show.value = false;
  }
  loading.close();
}

function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-releaseConfirmationPage {
  margin-top: 32vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
}
</style>
