<template>
  <div class="p-6 channelManagementPage">
    <MainTable
      ref="mainTableRef"
      v-show="!isShowCreatOrEdit && !isShowInfo"
      :isShowMainTable="!isShowCreatOrEdit && !isShowInfo"
      @infoEvent="infoEvent"
      :stationOptions="stationOptions"
    ></MainTable>
    <CreateOrEdit
      v-show="isShowCreatOrEdit"
      v-model="isShowCreatOrEdit"
      :currentNode="currentNode"
      :isEdit="infoType === 'edit'"
      :stationOptions="stationOptions"
      @infoTOMain="infoTOMain"
    ></CreateOrEdit>
    <InfoDetail
      v-show="isShowInfo"
      v-model="isShowInfo"
      :currentNode="currentNode"
      @infoToEdit="infoToEdit"
      @infoTOMain="infoTOMain"
    >
    </InfoDetail>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import { useChannelStore } from "@/stores/channel";
const channelStore = useChannelStore();
import MainTable from "./components/MainTable.vue";
import CreateOrEdit from "./components/CreateOrEdit.vue";
import InfoDetail from "./components/InfoDetail.vue";
import type { OptionType } from "@/views/systemNetworkNodeManagement/components/rules";
import { getNetworkNodes } from "@/api/stationnodes/index";

defineOptions({
  name: "ChannelManagement",
  inheritAttrs: false,
});

const infoType = ref<string>("create");
const isShowCreatOrEdit = ref<boolean>(false);
const isShowInfo = ref<boolean>(false);
const currentNode = ref<object>();

const mainTableRef = ref<any>(null);

const stationOptions = ref<OptionType[]>([]);
async function getChannelOption() {
  const res = await getNetworkNodes();
  if (res.code === 0 && res.data.length) {
    stationOptions.value = res.data;
  }
}

function infoTOMain() {
  if (mainTableRef.value.channelSelectValue) {
    mainTableRef.value.init({
      stationId: mainTableRef.value.channelSelectValue,
      stationName: mainTableRef.value.searchValue,
    });
  } else {
    mainTableRef.value.init();
  }
}
function infoEvent(type: string, node: any) {
  infoType.value = type;
  currentNode.value = node;
  if (type === "create" || type === "edit") {
    isShowCreatOrEdit.value = true;
    getChannelOption();
  } else if (type === "info") {
    isShowInfo.value = true;
  }
}

function infoToEdit() {
  infoType.value = "edit";
  isShowCreatOrEdit.value = true;
}

onMounted(() => {
  isShowCreatOrEdit.value = false;
  isShowInfo.value = false;
  if (mainTableRef.value.channelSelectValue) {
    mainTableRef.value.init({
      stationId: mainTableRef.value.channelSelectValue,
      stationName: mainTableRef.value.searchValue,
    });
  } else {
    // mainTableRef.value.init();
  }
  getChannelOption();
  if (channelStore.isJumpChannel) {
    nextTick(() => {
      isShowCreatOrEdit.value = false;

      currentNode.value = channelStore.channelNode;
      infoType.value = "info";
      isShowInfo.value = true;
    });
    channelStore.changeJumpChannelStatus(false);
  }
});

router.beforeEach((to, from, next) => {
  if (
    to.path === "/deviceManagement/channelManagement" &&
    channelStore.isJumpChannel &&
    (from.path === "/deviceManagement/deviceInstantiation" ||
      from.path === "/gateway/management")
  ) {
    nextTick(() => {
      isShowCreatOrEdit.value = false;
      currentNode.value = channelStore.channelNode;
      infoType.value = "info";
      isShowInfo.value = true;
      channelStore.changeJumpChannelStatus(false);
    });
  } else if (to.path === "/deviceManagement/channelManagement") {
    nextTick(() => {
      isShowCreatOrEdit.value = false;
      isShowInfo.value = false;
      mainTableRef.value.currentPage = 1;
      mainTableRef.value.pageSize = 10;
      mainTableRef.value.searchValue = "";
      mainTableRef.value.channelSelectValue = undefined;
    });
  }
  next();
});
</script>
<style lang="scss" scoped>
.channelManagementPage {
  display: block;
}
</style>
