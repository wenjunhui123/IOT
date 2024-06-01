<template>
  <div class="snapshotTablePage">
    <div class="flex mb-6">
      <el-checkbox
        class="w-[74px] important-h-6"
        v-model="isEnable"
        label="启用"
      />
      <el-form
        ref="ruleFormRef"
        class="bg-BG snapshotTableForm flex-1"
        label-position="top"
        :model="model"
        :rules="SnapshotTableRuleFormRules"
      >
        <el-form-item
          class="important-h-[56px] w-[260px]"
          :label="optionsTitle"
          prop="loggingInterval"
        >
          <el-select
            class="w-full"
            :disabled="!isEnable"
            v-model="model.loggingInterval"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="false" class="flex justify-between mb-6">
      <div>
        <span>选择测点</span>
        <span>({{ checkTableData.length }}/{{ tableData.length }})</span>
      </div>
      <el-checkbox-group v-model="isShowChecked">
        <el-checkbox-button label="只显示选中点"></el-checkbox-button
      ></el-checkbox-group>
    </div>
    <div class="w-full mb-4">
      <div class="mb-4">测点选择</div>
      <el-input
        size="small"
        placeholder="请输入测点名"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchChannel"
        clearable
      >
      </el-input>
    </div>
    <el-table
      ref="snapshotTableRef"
      class="w-full important-h-[380px]"
      :data="tableData"
      stripe
      @select="selectTableData"
      @select-all="selectTableAllData"
    >
      <template v-for="item in snapshotColumn" :key="item.prop">
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
      popper-class="channelManagement-page"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { type FormInstance, type TableInstance } from "element-plus";
import { SnapshotTableRuleFormRules, snapshotColumn } from "./rules";
import type { SnapshotTableRuleForm } from "./rules";
import { usePagination } from "@/utils/hook/pagination";
import {
  getProductSnapshotStrategy,
  getProductSnapshotTable,
  getProductMeasureSnapshotTable,
  newProductSnapshotTable,
  deleteProductSnapshotTable,
  updateProductSnapshotStrategy,
} from "@/api/productManage/index";
import type {
  ProductSnapshotStrategyResponse,
  ProductSnapshotTableResponse,
} from "@/api/productManage/types";

const productId: any = inject<number>("productId");
const isShowSnapshotQuick: any = inject<boolean>("isShowSnapshotQuick");

const props = withDefaults(
  defineProps<{
    snapshottype: string;
    activeName: string;
  }>(),
  {
    snapshottype: "virtual-time-recording",
  }
);

watch(
  () => [props.activeName, isShowSnapshotQuick.value],
  ([val1, val2]) => {
    if (val1 === props.snapshottype && val2) {
      nextTick(async () => {
        initData();
        checkTableData.value = [];
        let paraType = 1;
        if (val1 === "virtual-time-recording") {
          options.value = [
            { value: 1, label: "1", isChecked: false },
            { value: 3, label: "3", isChecked: false },
            { value: 5, label: "5", isChecked: false },
            { value: 10, label: "10", isChecked: false },
            { value: 15, label: "15", isChecked: false },
            { value: 30, label: "30", isChecked: false },
            { value: 60, label: "60", isChecked: false },
          ];
          optionsTitle.value = "记录间隔(分钟)";
        } else if (val1 === "second-time-recording") {
          paraType = 6;
          options.value = [
            { value: 1, label: "1", isChecked: false },
            { value: 2, label: "2", isChecked: false },
            { value: 3, label: "3", isChecked: false },
            { value: 5, label: "5", isChecked: false },
            { value: 10, label: "10", isChecked: false },
            { value: 20, label: "20", isChecked: false },
            { value: 30, label: "30", isChecked: false },
            { value: 60, label: "60", isChecked: false },
          ];
          optionsTitle.value = "最小记录间隔(秒)";
        }
        const res: UniversalReponse<ProductSnapshotStrategyResponse> =
          await getProductSnapshotStrategy(productId.value, paraType);
        if (res.code === 0 && res.data) {
          isEnable.value = res.data.flag;
          options.value.forEach((ite) => {
            if (res.data.interval === ite.value) {
              ite.isChecked = res.data.flag;
              model.loggingInterval = res.data.interval;
            }
          });
        }
        queryProductMeasureSnapshotTable();
        // queryProductSnapshotTable();
      });
    }
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = reactive<SnapshotTableRuleForm>({ loggingInterval: "" });

const isEnable = ref<boolean>(false);

const isShowChecked = ref<string[]>([]);

const optionsTitle = ref<string>("记录间隔(分钟)");
const options = ref<{ value: number; label: string; isChecked: boolean }[]>([]);

const searchValue = ref<string>("");
function searchChannel() {}

const snapshotTableRef = ref<TableInstance>();
const checkTableData = ref<ProductSnapshotTableResponse[]>([]);
const tableData = ref<ProductSnapshotTableResponse[]>([]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function selectTableData(
  selection: ProductSnapshotTableResponse[],
  row: ProductSnapshotTableResponse
) {
  const item = selection.find((ite) => {
    return (
      ite.para_handle === row.para_handle &&
      ite.property_type === row.property_type
    );
  });
  const item1 = checkTableData.value.find((ite) => {
    return (
      ite.para_handle === row.para_handle &&
      ite.property_type === row.property_type
    );
  });
  if (!item) {
    if (!row.flag) {
      checkTableData.value = checkTableData.value.filter((ite) => {
        return (
          ite.para_handle !== row.para_handle &&
          ite.property_type !== row.property_type
        );
      });
    } else {
      checkTableData.value.forEach((ite) => {
        if (
          ite.para_handle === row.para_handle &&
          ite.property_type === row.property_type
        ) {
          ite.newDeleted = true;
        }
      });
    }
  } else {
    if (item1) {
      checkTableData.value.forEach((ite) => {
        ite.newDeleted = false;
      });
    } else {
      checkTableData.value.push({ ...row, newSelected: true });
    }
  }
}

function selectTableAllData(selection: ProductSnapshotTableResponse[]) {
  tableData.value.forEach((item) => {
    selectTableData(selection, item);
  });
}

function sizeChange(val: number) {
  pageSize.value = val;
  queryProductMeasureSnapshotTable();
}
function currentChange(val: number) {
  currentPage.value = val;
  queryProductMeasureSnapshotTable();
}

async function queryProductMeasureSnapshotTable() {
  const params = {
    page_size: pageSize.value,
    page: currentPage.value,
    solution: "not_null",
  };
  const para_type: number =
    props.snapshottype === "virtual-time-recording" ? 1 : 6;
  const res: UniversalReponse<ProductSnapshotTableResponse[]> =
    await getProductMeasureSnapshotTable(productId.value, para_type, params);
  if (res.code === 0 && res.data?.length) {
    tableData.value = res.data;
    totalCount.value = res.total as number;
    tableData.value.forEach((item) => {
      item.newSelected = false;
      item.newDeleted = false;
      const newItem = checkTableData.value.find((ite) => {
        return (
          ite.para_handle === item.para_handle &&
          ite.property_type === item.property_type &&
          !item.flag
        );
      });
      const oldItem = checkTableData.value.find((ite) => {
        return (
          ite.para_handle === item.para_handle &&
          ite.property_type === item.property_type &&
          item.flag
        );
      });
      if (item.flag || newItem) {
        if (!oldItem || (oldItem && !oldItem.newDeleted)) {
          setTimeout(() => {
            snapshotTableRef.value?.toggleRowSelection(item, true);
          }, 0);
        }
        if (!newItem && !oldItem) {
          checkTableData.value.push(item);
        }
      }
    });
  } else {
    tableData.value = [];
    totalCount.value = 0;
  }
}

async function queryProductSnapshotTable() {
  const params = {
    page_size: pageSize.value,
    page: currentPage.value,
  };
  const para_type: number =
    props.snapshottype === "virtual-time-recording" ? 1 : 6;
  const res: UniversalReponse<ProductSnapshotTableResponse[]> =
    await getProductSnapshotTable(productId.value, para_type, params);
  if (res.code === 0 && res.data?.length) {
    res.data.forEach((item) => {
      item.flag = true;
      item.newSelected = false;
      item.newDeleted = false;
    });
    checkTableData.value = res.data;
  } else {
    checkTableData.value = [];
  }
}

/* 表单上传模块 */
async function validate(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const newSelected = checkTableData.value
        .filter((item) => {
          return item.newSelected && !item.flag;
        })
        .map((ite) => {
          return {
            para_handle: ite.para_handle,
            property_type: ite.property_type,
          };
        });
      const newDeleted = checkTableData.value
        .filter((item) => {
          return item.newDeleted && item.flag;
        })
        .map((ite) => {
          return {
            para_handle: ite.para_handle,
            property_type: ite.property_type,
          };
        });
      const para_type: number =
        props.snapshottype === "virtual-time-recording" ? 1 : 6;
      await updateProductSnapshotStrategy(productId.value, para_type, {
        interval: model.loggingInterval as number,
        flag: isEnable.value,
      });
      if (newSelected?.length) {
        await newProductSnapshotTable(productId.value, para_type, newSelected);
      }
      if (newDeleted?.length) {
        await deleteProductSnapshotTable(
          productId.value,
          para_type,
          newDeleted
        );
      }
      ElMessage.success("编辑成功");
    }
  });
}

function initData() {
  checkTableData.value = [];
  currentPage.value = 1;
  //   queryProductMeasureSnapshotTable();
}

defineExpose({
  ruleFormRef,
  validate,
});
</script>
<style lang="scss" scoped>
.snapshotTablePage {
  .snapshotTableForm {
    @include background_color(BG1);
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }
    :deep(.el-form-item__label) {
      @include font_color("T1");
      padding: 0 !important;
      height: 24px !important;
      line-height: 24px !important;
      margin-bottom: 0;
    }
  }
}
</style>
