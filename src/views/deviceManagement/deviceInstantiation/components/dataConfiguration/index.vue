<template>
  <div class="dataConfiguration-page h-full">
    <div class="flex mb-6">
      <el-button v-if="!isEditing" type="primary" @click="editDataConfig"
        >编辑数据配置</el-button
      >
      <el-button v-if="isEditing" class="mr-2" @click="cancelEditing"
        >取消编辑</el-button
      ><el-button v-if="isEditing" type="primary" @click="saveDataConfig"
        >保存配置</el-button
      >
    </div>
    <div class="h-[calc(100%-40px)] infoDetailContent">
      <EditConfiguration
        v-if="isEditing"
        ref="editConfigurationRef"
        @ok="editOrReadConfiguration"
      ></EditConfiguration>
      <ReadConfiguration
        v-if="!isEditing"
        ref="readConfigurationRef"
        @ok="editOrReadConfiguration"
      ></ReadConfiguration>
    </div>
  </div>
</template>
<script setup lang="ts">
import EditConfiguration from "./EditConfiguration.vue";
import ReadConfiguration from "./ReadConfiguration.vue";

/*
事件定义
*/
const emit = defineEmits(["updateDeviceInfo"]);

const deviceInfoDetail: any = inject("deviceInfoDetail");

watch(
  () => deviceInfoDetail.value,
  (val) => {
    nextTick(() => {
      isEditing.value = false;
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

const editConfigurationRef = ref<any>(null);
const readConfigurationRef = ref<any>(null);

const isEditing = ref<boolean>(false);
function editDataConfig() {
  isEditing.value = true;
}
function cancelEditing() {
  isEditing.value = false;
}

function editOrReadConfiguration(type: string) {
  if (type === "edit") {
    isEditing.value = false;
    emit("updateDeviceInfo");
  }
}
async function saveDataConfig() {
  editConfigurationRef.value.confirm(
    editConfigurationRef.value.ruleFormRef,
    editConfigurationRef.value.advanceFormRef
  );
}
</script>
<style scoped lang="scss">
.dataConfiguration-page {
  .infoDetailContent {
    :deep(.el-tabs__item) {
      height: 40px !important;
    }
    :deep(.el-tabs__content) {
      height: calc(100% - 40px);
    }

    :deep(.el-tab-pane) {
      height: 100%;
    }

    :deep(.el-textarea__inner) {
      height: calc(100% - 40px);
    }
  }
}
</style>
