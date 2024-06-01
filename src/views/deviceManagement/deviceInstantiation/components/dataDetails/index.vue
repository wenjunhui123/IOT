<template>
  <div class="h-full box-border pt-2 dataDetailsPage">
    <el-tabs
      v-model="activeName"
      class="h-full dataDetailsTabs"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane lazy label="实时数据" name="实时数据"
        ><RealTimeData></RealTimeData
      ></el-tab-pane>
      <el-tab-pane lazy label="事件查询" name="事件查询"
        ><EventQuery></EventQuery
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import EventQuery from "./EventQuery.vue";
import RealTimeData from "./RealTimeData.vue";

/*
事件定义
*/
const emit = defineEmits(["ok"]);

const deviceInfoDetail: any = inject("deviceInfoDetail");

const activeName = ref<string>("实时数据");
function handleClick() {}
</script>
<style scoped lang="scss">
.dataDetailsPage {
  .dataDetailsTabs {
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
