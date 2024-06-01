<template>
  <el-dialog
    custom-class="productManagement-createAlarmPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditeAlarmForm"
      label-position="top"
      :model="model"
      :rules="AlarmFormRules"
    >
      <div class="mb-[10px] flex">
        <div
          class="px-6 py-4 bg-BG1 rounded-lg box-border w-[640px] h-[668px] mr-[10px]"
        >
          <div
            class="h-[18px] leading-[18px] text-T2 text-[14px] font-medium mb-4"
          >
            选择测点
          </div>
          <el-form-item
            class="important-h-[56px] mb-4"
            label="告警分类"
            prop="event_type"
          >
            <el-select
              class="w-full"
              v-model="model.event_type"
              placeholder="请选择"
              @change="changeAlarmClassfication"
            >
              <el-option
                v-for="item in alarmClassficationOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div class="w-full important-h-[calc(100%-106px)]">
            <el-input
              class="mb-4"
              size="small"
              placeholder="请输入关键字"
              :suffix-icon="Search"
              v-model="searchValue"
              @blur="searchChannel"
              clearable
            >
            </el-input>
            <el-table
              class="w-full important-h-[410px]"
              :data="tableData"
              ref="measurePonitsRef"
              stripe
              @select="selectMeasurePoints"
              @select-all="selectAllMeasurePoints"
            >
              <template v-for="item in tableDataColumn" :key="item.prop">
                <el-table-column v-bind="item" />
              </template>
            </el-table>
            <el-pagination
              class="pt-5 fr"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="pageSizes"
              :layout="layout"
              :total="totalCount"
              :pager-count="2"
              popper-class="channelManagement-page"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
          </div>
        </div>
        <div
          class="flex flex-col px-6 py-4 bg-BG1 rounded-lg box-border w-[393px] h-[668px]"
        >
          <div
            class="h-[18px] leading-[18px] text-T2 text-[14px] font-medium mb-6"
          >
            告警设置
          </div>
          <div class="flex justify-between">
            <div class="w-[160px] mr-6">
              <el-form-item
                v-if="model.event_type !== 1"
                class="important-h-[56px] mb-6"
                label="告警级别"
                prop="event_level"
              >
                <el-select
                  class="w-full"
                  v-model="model.event_level"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in alarmLevelOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="上限值"
                prop="param1"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param1"
                  placeholder="请输入上限值"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3 || model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="动作延时(秒)"
                prop="action_delay"
              >
                <el-input-number
                  :controls="false"
                  :precision="0"
                  v-model="model.action_delay"
                  placeholder="请输入动作延时"
                />
              </el-form-item>
            </div>
            <div class="w-[160px]">
              <el-form-item
                v-if="model.event_type === 2 || model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="动作类型"
                prop="action_type"
              >
                <el-select
                  class="w-full"
                  v-model="model.action_type"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in actionTypeOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="枚举值"
                prop="param1"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param1"
                  placeholder="请输入枚举"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3"
                class="important-h-[56px] mb-6"
                label="下限值"
                prop="param2"
              >
                <el-input-number
                  :controls="false"
                  :precision="2"
                  v-model="model.param2"
                  placeholder="请输入下限值"
                />
              </el-form-item>
              <el-form-item
                v-if="model.event_type === 3 || model.event_type === 5"
                class="important-h-[56px] mb-6"
                label="返回延时(秒)"
                prop="return_delay"
              >
                <el-input-number
                  :controls="false"
                  :precision="0"
                  v-model="model.return_delay"
                  placeholder="请输入返回延时"
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item
            v-if="model.event_type === 1"
            class="important-h-[56px] mb-6"
            label="告警级别"
            prop="event_level"
          >
            <el-select
              class="w-full"
              v-model="model.event_level"
              placeholder="请选择"
            >
              <el-option
                v-for="item in alarmLevelOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div class="flex-1 alarmDescription">
            <el-form-item
              class="h-full mb-4"
              label="告警描述"
              prop="event_desc"
            >
              <template #label
                ><span>告警描述</span>
                <el-tooltip effect="dark" placement="right">
                  <i class="el-icon-question"></i>
                  <template #content>
                    <i class="el-icon-question"></i>告警描述说明<br />
                    厂站名称：%StationName% <br />
                    通道名称：%ChannelName%<br />
                    设备名称：%DeviceName%<br />
                    测点名称：%MeasureName%<br />
                    越限类型：%ACTType%<br />
                    告警类型：%WSPType% <br />告警特征值：%WSPValue%
                  </template>
                </el-tooltip>
              </template>
              <el-input
                class="h-full"
                resize="none"
                v-model="model.event_desc"
                type="textarea"
                placeholder="请输入告警描述"
              />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { usePagination } from "@/utils/hook/pagination";
import { AlarmFormRules, snapshotColumn, snapshotDeviceColumn } from "./rules";
import type { AlarmClassfication, MeasurePoints, AlarmForm } from "./rules";
import {
  getProductProperty,
  createProductAlarm,
} from "@/api/productManage/index";
import type {
  ProductPropertyResponse,
  CreateOrEditProductAlarmQuery,
} from "@/api/productManage/types";
import { cloneDeep } from "lodash-es";

const productId: any = inject<number>("productId");
const currentTemplate: any = inject("currentTemplate");

watch(
  () => [productId.value, props.modelValue],
  ([val1, val2]) => {
    if (val1 && val2) {
      nextTick(() => {
        emptyData();
        queryProductProperty();
      });
    }
  },
  { immediate: true, deep: true }
);

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
  title: "新增告警点",
  width: "1060px",
});

const alarmClassficationOptions = ref<AlarmClassfication[]>([
  {
    id: 2,
    name: "开关量变位",
  },
  {
    id: 1,
    name: "设备定值越限",
  },
  {
    id: 3,
    name: "上位机模拟量越限",
  },
  {
    id: 5,
    name: "模拟量枚举值越限",
  },
]);
function changeAlarmClassfication(val: number) {
  if (val === 1) {
    tableDataColumn.value = snapshotDeviceColumn;
    formatterTableData(currentPage.value, pageSize.value);
  } else {
    tableDataColumn.value = snapshotColumn;
    queryProductProperty();
  }
}

const alarmLevelOption = ref<AlarmClassfication[]>([
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
const actionTypeOption = ref<AlarmClassfication[]>([
  {
    id: 2,
    name: "打开",
  },
  {
    id: 1,
    name: "闭合",
  },
]);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<AlarmForm>({
  event_id: 0,
  event_type: 2,
  event_level: 1,
  action_type: 1,
  param1: 0,
  param2: 0,
  action_delay: 0,
  return_delay: 0,
  event_desc:
    "%StationName% %ChannelName% %DeviceName% %MeasureName% %WSPType% %ACTType% %WSPValue%",
  para: [],
  need_save: true,
});

watch(
  () => model.value.event_type,
  (val) => {
    if (val === 2) {
      actionTypeOption.value = [
        {
          id: 2,
          name: "打开",
        },
        {
          id: 1,
          name: "闭合",
        },
      ];
    } else if (val === 3) {
      actionTypeOption.value = [
        {
          id: 1,
          name: "越上限",
        },
        {
          id: 2,
          name: "越下限",
        },
      ];
    }
  },
  { deep: true, immediate: true }
);

const searchValue = ref<string>("");
function searchChannel() {}

const measurePonitsRef = ref<TableInstance>();
const tableData = ref<ProductPropertyResponse[]>([]);
const tableDataColumn = ref(snapshotColumn);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function sizeChange(val: number) {
  pageSize.value = val;
  if (model.value.event_type === 1) {
    formatterTableData(currentPage.value, val);
  } else {
    queryProductProperty();
  }
}
function currentChange(val: number) {
  currentPage.value = val;
  if (model.value.event_type === 1) {
    formatterTableData(val, pageSize.value);
  } else {
    queryProductProperty();
  }
}
function selectMeasurePoints(
  selection: ProductPropertyResponse[],
  row: ProductPropertyResponse
) {
  if (model.value.event_type === 1) {
    const item = selection.find((ite) => {
      return ite.para_handle === row.para_handle;
    });
    if (item) {
      model.value.para?.push(item.para_handle);
    } else {
      model.value.para = model.value.para?.filter((ite) => {
        return ite !== row.para_handle;
      });
    }
  } else {
    const item = selection.find((ite) => {
      return ite.property_id === row.property_id;
    });
    if (item) {
      model.value.para?.push(item.property_id);
    } else {
      model.value.para = model.value.para?.filter((ite) => {
        return ite !== row.property_id;
      });
    }
  }
}
function selectAllMeasurePoints(selection: ProductPropertyResponse[]) {
  if (model.value.event_type === 1) {
    model.value.para = selection.map((item) => {
      return item.para_handle;
    });
  } else {
    model.value.para = selection.map((item) => {
      return item.property_id;
    });
  }
}

function formatterTableData(currentPage: number, pageSize: number) {
  const length =
    256 > currentPage * pageSize
      ? pageSize
      : 256 - (currentPage - 1) * pageSize;
  tableData.value = Array.from({ length: length }).map((_, idx) => ({
    property_id: idx + 1 + (currentPage - 1) * pageSize,
    property_name: `越限项${idx + 1 + (currentPage - 1) * pageSize}`,
    property_type: idx + 1 + (currentPage - 1) * pageSize,
    para_handle: idx + 1 + (currentPage - 1) * pageSize,
    data_id: idx + 1 + (currentPage - 1) * pageSize,
    data_name: `越限项${idx + 1 + (currentPage - 1) * pageSize}`,
    logical_id: idx + 1 + (currentPage - 1) * pageSize,
    property_option: {},
  }));
  totalCount.value = 256;
}

async function queryProductProperty() {
  const params = {
    page_size: pageSize.value,
    page: currentPage.value,
    property_type:
      model.value.event_type === 2
        ? 2
        : model.value.event_type === 3 || model.value.event_type === 5
        ? 1
        : 0,
    property_name: "",
  };
  const res: UniversalReponse<ProductPropertyResponse[]> =
    await getProductProperty(productId.value, params);
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
    tableData.value.forEach((item) => {
      const chooseItem = model.value.para?.find((ite) => {
        return ite === item.property_id;
      });
      if (chooseItem) {
        setTimeout(() => {
          measurePonitsRef.value?.toggleRowSelection(item, true);
        }, 0);
      }
    });
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

/* 清空表格 */
function emptyData() {
  model.value = {
    event_id: 0,
    event_type: 2,
    event_level: 1,
    action_type: 1,
    param1: 0,
    param2: 0,
    action_delay: 0,
    return_delay: 0,
    event_desc:
      "%StationName% %ChannelName% %DeviceName% %MeasureName% %WSPType% %ACTType% %WSPValue%",
    para: [],
    need_save: true,
  };
  tableDataColumn.value = snapshotColumn;
}

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let params: CreateOrEditProductAlarmQuery[] = [];
      let param = cloneDeep(model.value);
      delete param.event_id;
      if (model.value.event_type === 2) {
        delete param.param2;
      } else if (model.value.event_type === 1 || model.value.event_type === 5) {
        delete param.param2;
        delete param.action_type;
      }
      model.value.para!.forEach((item: any) => {
        params.push({ ...param, para: item });
      });
      if (!params?.length) {
        return ElMessage.warning("请选择测量参数");
      }
      const res: UniversalReponse<object> = await createProductAlarm(
        productId.value,
        currentTemplate.value.id as number,
        params
      );
      if (res.code === 0) {
        show.value = false;
        ElMessage.success("新增告警点成功！");
        emit("infoTOMain", "createAlarm");
      }
    }
  });
}
function cancel() {
  show.value = false;
}
</script>
<style lang="scss">
.productManagement-createAlarmPage {
  margin-top: 6vh;

  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }

  .createOrEditeAlarmForm {
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

      .el-input-number {
        width: 100%;
      }
    }

    .el-transfer__buttons {
      padding: 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .el-transfer__button:nth-child(2) {
        margin-left: 0;
      }
    }

    .el-transfer-panel__body {
      height: calc(100% - 55px);
      padding-bottom: 15px;

      .el-transfer-panel__filter {
        padding: 0;
        width: calc(100% - 30px);
      }
    }

    .alarmDescription {
      .el-form-item__content {
        height: calc(100% - 28px);
      }
    }

    .el-pagination__sizes {
      margin: 0;
    }
  }
}
</style>
