<template>
  <el-dialog
    custom-class="productManagement-snapshotQuickConfigurationPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-tabs v-model="activeName" :before-leave="beforeLeave">
      <el-tab-pane lazy label="虚拟定时记录" name="virtual-time-recording"
        ><SnapshotTable
          ref="virtualSnapshotTableRef"
          snapshottype="virtual-time-recording"
          :activeName="activeName"
        ></SnapshotTable
      ></el-tab-pane>
      <el-tab-pane lazy label="秒级定时记录" name="second-time-recording"
        ><SnapshotTable
          ref="secondSnapshotTableRef"
          snapshottype="second-time-recording"
          :activeName="activeName"
        ></SnapshotTable
      ></el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { TabPaneName } from "element-plus";
import SnapshotTable from "./SnapshotTable.vue";

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

const isCrossOver = ref<boolean>(false);
const activeName = ref("virtual-time-recording");
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      isCrossOver.value = false;
    } else {
      activeName.value = "virtual-time-recording";
      isCrossOver.value = true;
    }
  },
  { immediate: true, deep: true }
);

const virtualSnapshotTableRef = ref<any>(null);
const secondSnapshotTableRef = ref<any>(null);

const dialogConfig = reactive({
  title: "快照配置",
  width: "640px",
});

const beforeLeave = async (currentName: TabPaneName, oldName: TabPaneName) => {
  if (isCrossOver.value) {
    return true;
  }
  const mesbox: string = await ElMessageBox.confirm(
    "切换/离开此页面会导致未提交编辑丢失",
    "提醒",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  if (mesbox === "confirm") {
    return true;
  } else {
    return false;
  }
};

/* 表单上传模块 */
async function confirm() {
  if (activeName.value === "virtual-time-recording") {
    virtualSnapshotTableRef.value.validate(
      virtualSnapshotTableRef.value.ruleFormRef
    );
  } else if (activeName.value === "second-time-recording") {
    secondSnapshotTableRef.value.validate(
      secondSnapshotTableRef.value.ruleFormRef
    );
  }
  emit("ok");
  show.value = false;
}
function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-snapshotQuickConfigurationPage {
  margin-top: 6vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .el-tabs {
    @include background_color(BG1);
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__content {
      padding: 0 24px 24px 24px;
    }
  }
}
</style>
