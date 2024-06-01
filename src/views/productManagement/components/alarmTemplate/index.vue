<template>
  <div class="h-full">
    <div class="w-full mb-6 h-[40px] flex templateHeader overflow-y-auto">
      <div
        :class="{ alarmtemplate: true, isCheckedTemplate: item.isChecked }"
        v-for="item in alarmTemplateArr"
        :key="item.id"
        @click="checkAlarmTemplate(item)"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.name"
          placement="top-start"
        >
          <span
            class="float-left mr-6 text-[14px] h-[18px] justify-center max-w-[calc(100%-56px)] overflow-hidden text-ellipsis whitespace-nowrap"
            >{{ item.name }}</span
          >
        </el-tooltip>
        <EditPen
          class="cursor-pointer w-[14px] h-[14px] mr-1"
          @click.stop="editALarmTemplate(item)"
        ></EditPen>
        <Close
          class="cursor-pointer w-[14px] h-[14px]"
          @click.stop="closeALarmTemplate(item.id)"
        ></Close>
      </div>
      <el-input
        v-if="isShowNewTemplate"
        ref="newTemplateValueRef"
        class="important-w-[240px] mr-6"
        size="small"
        placeholder="请输入告警模板名称"
        v-model="newTemplateValue"
        @blur="blurTemplateFun"
        clearable
      >
      </el-input>
      <el-button
        v-if="!isShowNewTemplate"
        type="primary"
        size="large"
        @click="createTemplateFun"
        >+ 告警模板</el-button
      >
    </div>
    <div class="w-full mb-6 flex h-[32px] items-center justify-between">
      <div class="flex">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="currentTemplate.name"
          placement="top-start"
        >
          <div
            class="float-left text-[16px] text-T2 max-w-[338px] pt-1 h-[32px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ currentTemplate.name }}
          </div>
        </el-tooltip>
        <div class="h-[32px]" v-if="currentTemplate.id">
          <span
            v-if="currentTemplate.is_release"
            class="float-left box-border leading-6 px-2 py-1 cursor-alias ml-2 rounded-[3px] h-[28px] bg-[rgba(41,176,97,0.1)] text-[#29B061] text-[12px]"
          >
            已上线
          </span>
          <span
            v-else
            class="float-left box-border leading-6 px-2 py-1 cursor-alias ml-2 rounded-[3px] h-[28px] bg-[rgba(249,94,90,0.1)] text-[rgba(249,94,90,0.57)] text-[12px]"
          >
            未上线
          </span>
        </div>
      </div>
      <div class="float-right flex overflow-y-hidden overflow-x-auto">
        <PesudoFormItem class="mr-4 float-right" label="测量参数">
          <el-input
            class="important-w-[150px]"
            size="small"
            placeholder="请输入测量参数"
            v-model="measurePointName"
            @blur="changeMeasurePointName"
            clearable
          >
          </el-input>
        </PesudoFormItem>
        <PesudoFormItem class="mr-4 float-right" label="告警分类">
          <el-select
            class="important-w-[150px]"
            v-model="alarmClassficationValue"
            placeholder="请选择告警分类"
            @change="changeAlarmClassficationOptions"
          >
            <el-option
              v-for="item in alarmClassficationOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </PesudoFormItem>
        <PesudoFormItem class="float-right mr-2" label="告警级别">
          <el-select
            class="important-w-[150px]"
            v-model="alarmLevelValue"
            placeholder="请选择告警级别"
            @change="changeAlarmLevelOptions"
          >
            <el-option
              v-for="item in alarmLevelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </PesudoFormItem>
        <el-button class="float-right" @click="importTemplate">导入</el-button>
        <el-button class="float-right" @click="exportTemplate">导出</el-button>
        <el-button class="float-right" @click="alarmRelease"
          >发布告警</el-button
        >
        <el-button class="float-right mr-2" @click="associatedDevices"
          >关联设备</el-button
        >
        <el-button class="float-right" type="primary" @click="addAlarmPoint"
          >+ 新增告警点</el-button
        >
      </div>
    </div>
    <div class="h-[calc(100%-176px)]">
      <el-table
        class="alarmTemplateTable"
        :data="tableData"
        style="width: 100%; height: 100%"
      >
        <template v-for="item in tableDataColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <el-table-column
          prop="event_desc"
          label="告警描述"
          :show-overflow-tooltip="true"
          minWidth="150px"
          align="left"
        >
          <template slot="header" #header="scope"
            ><span>告警描述</span>
            <el-tooltip effect="dark" placement="top">
              <i class="el-icon-question"></i>
              <template #content>
                厂站名称：%StationName% <br />
                通道名称：%ChannelName%<br />
                设备名称：%DeviceName%<br />
                测点名称：%MeasureName%<br />
                越限类型：%ACTType%<br />
                告警类型：%WSPType% <br />告警特征值：%WSPValue%
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="left">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleCheck(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.event_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty class="empty">
          <el-empty
            :image="theme === 'light' ? emptyImgUrl[0] : emptyImgUrl[1]"
            :image-size="80"
          ></el-empty>
        </template>
      </el-table>
      <el-pagination
        class="pt-5 fr"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="totalCount"
        popper-class="channelManagement-page"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <EditTemplate
      v-model="isShowEditTemplate"
      :alarmTemplate="checkedTemplate"
      @infoTOMain="infoTOMain"
    ></EditTemplate>
    <CreateAlarm
      v-model="isShowCreateAlarm"
      @infoTOMain="infoTOMain"
    ></CreateAlarm>
    <EditAlarm
      v-model="isShowEditAlarm"
      :chooseItem="chooseItem"
      @infoTOMain="infoTOMain"
    ></EditAlarm>
    <AssociateDevicesDialog
      v-model="isShowAssociateDevices"
      :currentTemplate="currentTemplate"
    ></AssociateDevicesDialog>
  </div>
</template>
<script setup lang="ts">
import { EditPen, Close } from "@element-plus/icons-vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { tableColumn } from "./rules";
import type { AlarmTemplate } from "./rules";
import EditTemplate from "./EditTemplate.vue";
import CreateAlarm from "./CreateAlarm.vue";
import EditAlarm from "./EditAlarm.vue";
import AssociateDevicesDialog from "./AssociateAllDevicesDialog.vue";
import {
  getProductAlarmTemplate,
  createProductAlarmTemplate,
  deleteProductAlarmTemplate,
  getProductAlarm,
  deleteProductAlarm,
  eventModelRelease,
} from "@/api/productManage/index";
import type {
  ProductAlarmTemplateResponse,
  ProductAlarmResponse,
} from "@/api/productManage/types";

const productId: any = inject<number>("productId");

watch(
  () => productId,
  (val: Ref) => {
    if (val.value) {
      nextTick(() => {
        queryProductAlarmTemplate();
      });
    }
  },
  { immediate: true, deep: true }
);

const isShowEditTemplate = ref<boolean>(false);
const alarmTemplateArr = ref<AlarmTemplate[]>([]);
const checkedTemplate = ref<AlarmTemplate>({
  name: "",
  id: 0,
  is_release: false,
  isChecked: false,
});
const currentTemplate = ref<AlarmTemplate>({
  name: "",
  id: 0,
  is_release: false,
  isChecked: false,
});
function checkAlarmTemplate(item: AlarmTemplate): void {
  alarmTemplateArr.value.forEach((ele) => {
    if (ele.id === item.id) {
      ele.isChecked = true;
      currentTemplate.value = ele;
    } else {
      ele.isChecked = false;
    }
  });
  queryProductAlarm();
}
function editALarmTemplate(item: AlarmTemplate) {
  isShowEditTemplate.value = true;
  checkedTemplate.value = item;
}
function closeALarmTemplate(id: number) {
  ElMessageBox.confirm("确定要删除该模板吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res: UniversalReponse<ProductAlarmTemplateResponse[]> =
        await deleteProductAlarmTemplate(productId.value, [id]);
      if (res.code === 0) {
        ElMessage.success("删除模板成功！");
        newTemplateValue.value = "";
        queryProductAlarmTemplate();
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

const newTemplateValueRef = ref();
const isShowNewTemplate = ref<boolean>(false);
const newTemplateValue = ref<string>("");
function blurTemplateFun() {
  if (newTemplateValue.value.length > 125) {
    return ElMessage.warning("输入字符不能超过125个字符");
  }
  isShowNewTemplate.value = false;
  if (!newTemplateValue.value) {
    return;
  }
  nextTick(async () => {
    const res: UniversalReponse<ProductAlarmTemplateResponse[]> =
      await createProductAlarmTemplate(productId.value, {
        strategy_name: newTemplateValue.value,
      });
    if (res.code === 0) {
      ElMessage.success("新增成功！");
      newTemplateValue.value = "";
      queryProductAlarmTemplate();
    }
  });
}

function createTemplateFun() {
  isShowNewTemplate.value = true;
  nextTick(async () => {
    newTemplateValueRef.value.focus();
  });
}
function infoTOMain(type: string) {
  if (type === "editTemplate") {
    queryProductAlarmTemplate();
  } else if (type === "createAlarm") {
    if ((totalCount.value / pageSize.value) % 1 !== 0) {
      currentPage.value = Math.ceil(totalCount.value / pageSize.value);
    } else {
      currentPage.value = Math.ceil(totalCount.value / pageSize.value) + 1;
    }
    queryProductAlarm();
  } else if (type === "editAlarm") {
    queryProductAlarm();
  }
}

const measurePointName = ref<string>("");
function changeMeasurePointName() {
  queryProductAlarm();
}

const alarmClassficationValue = ref(0);
const alarmClassficationOptions = ref([
  { id: 0, name: "全部" },
  { id: 2, name: "开关量变位" },
  { id: 1, name: "设备定值越限" },
  { id: 3, name: "上位机模拟量越限" },
  //   { id: 4, name: "上位机统计量越限" },
  { id: 5, name: "模拟量枚举值越限" },
  //   { id: 6, name: "开关量枚举值越限" },
]);
function changeAlarmClassficationOptions() {
  queryProductAlarm();
}

const alarmLevelValue = ref(0);
const alarmLevelOptions = ref([
  { id: 0, name: "全部" },
  {
    id: 2,
    name: "事故",
  },
  {
    id: 3,
    name: "报警",
  },
  {
    id: 4,
    name: "一般",
  },
  {
    id: 1,
    name: "其它",
  },
  {
    id: 5,
    name: "预警",
  },
]);
function changeAlarmLevelOptions() {
  queryProductAlarm();
}

const isShowCreateAlarm = ref<boolean>(false);
const isShowEditAlarm = ref<boolean>(false);
const isShowAssociateDevices = ref<boolean>(false);
function importTemplate() {}
function exportTemplate() {}
async function alarmRelease() {
  if (currentTemplate.value?.id) {
    const param = {
      product_id: productId.value,
      event_model_id: currentTemplate.value.id,
    };
    const res = await eventModelRelease(param);
    if (res.code === 0) {
      ElMessage.success("告警模板发布成功！");
      queryProductAlarmTemplate(true);
    }
  } else {
    ElMessage.warning("请选择告警模板进行上线！");
  }
}
function associatedDevices() {
  if (currentTemplate.value?.id && currentTemplate.value?.is_release) {
    isShowAssociateDevices.value = true;
  } else {
    ElMessage.warning("请选择已经上线的告警模板！");
  }
}
function addAlarmPoint() {
  if (alarmTemplateArr.value?.length === 0) {
    return ElMessage.warning("请先新增告警模板！");
  }
  isShowCreateAlarm.value = true;
}

const chooseItem = ref<ProductAlarmResponse>();
const tableData = ref<object[]>([]);
const tableDataColumn = ref(tableColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  queryProductAlarm();
}
function currentChange(val: number) {
  currentPage.value = val;
  queryProductAlarm();
}

function handleCheck(item: ProductAlarmResponse) {
  isShowEditAlarm.value = true;
  chooseItem.value = item;
}
function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该告警事件吗", "提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res: UniversalReponse<object> = await deleteProductAlarm(
        productId.value,
        currentTemplate.value?.id as number,
        [id]
      );
      if (res.code === 0) {
        ElMessage.success("成功删除告警事件！");
        queryProductAlarm();
      }
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
}

const settingsStore = useSettingsStore();
let theme = ref<string>(settingsStore.theme);
settingsStore.$subscribe((mutation, state) => {
  theme.value = state.theme;
});
const emptyImgUrl = ref([
  new URL("../../assets/emptyData-light.svg", import.meta.url).href,
  new URL("../../assets/emptyData-dark.svg", import.meta.url).href,
]);

async function queryProductAlarmTemplate(is_alarm: boolean = false) {
  const param = {
    page_size: 1000,
    page: 1,
  };
  const res: UniversalReponse<ProductAlarmTemplateResponse[]> =
    await getProductAlarmTemplate(productId.value, param);
  alarmTemplateArr.value = [];
  if (!is_alarm) {
    currentTemplate.value = {
      name: "",
      id: 0,
      is_release: false,
      isChecked: false,
    };
  }

  if (res.code === 0 && res.data?.length) {
    res.data.forEach((item, index) => {
      const param: AlarmTemplate = {
        id: item.strategy_id,
        name: item.strategy_name,
        is_release: item.is_release,
        isChecked: false,
      };
      if (index === 0 && !is_alarm) {
        currentTemplate.value = param;
        param.isChecked = true;
      }
      if (is_alarm) {
        if (currentTemplate.value?.id === param.id) {
          param.isChecked = true;
          currentTemplate.value = param;
        } else {
          param.isChecked = false;
        }
      }
      alarmTemplateArr.value.push(param);
    });
    queryProductAlarm();
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

async function queryProductAlarm() {
  const param = {
    page_size: pageSize.value,
    page: currentPage.value,
    event_type: alarmClassficationValue.value,
    event_level: alarmLevelValue.value,
    para_name: measurePointName.value,
  };
  const res: UniversalReponse<ProductAlarmResponse[]> = await getProductAlarm(
    productId.value,
    currentTemplate.value?.id as number,
    param
  );
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

provide("currentTemplate", currentTemplate);
</script>
<style lang="scss" scoped>
.alarmtemplate {
  cursor: pointer;
  display: flex;
  margin-right: 16px;
  padding: 11px 12px;
  border-radius: 3px;
  border: 1px solid;
  max-width: 200px;
  overflow: hidden;
  @include background_color(BG1);
  @include border_color(B1);
}

.templateHeader .isCheckedTemplate {
  @include background_color(BG4);
  @include border_color(ZS);
  @include font_color(ZS);
}

.alarmTemplateTable {
  :deep(.el-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
