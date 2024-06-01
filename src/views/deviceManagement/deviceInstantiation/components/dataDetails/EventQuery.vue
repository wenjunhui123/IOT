<template>
  <div class="h-full">
    <div class="w-full mt-2 mb-4 flex">
      <el-input
        class="important-w-[280px] mr-4"
        size="small"
        placeholder="请输入关键字"
        :suffix-icon="Search"
        v-model="searchValue"
        @blur="searchChannel"
        clearable
      >
      </el-input>
      <PesudoFormItem class="mr-4" label="事件类型">
        <el-select
          class="important-w-[150px]"
          v-model="eventTypeValue"
          placeholder="请选择事件类型"
          @change="changeEventType"
        >
          <el-option
            v-for="item in eventTypeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </PesudoFormItem>
      <PesudoFormItem class="mr-4" label="告警级别">
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
      <PesudoFormItem class="mr-2" label="查询日期">
        <el-date-picker
          class="important-w-[360px]"
          v-model="datetimerange"
          type="datetimerange"
          :shortcuts="shortcuts"
          format="YYYY-MM-DD HH:mm"
          :disabled-date="disabledDate"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </PesudoFormItem>
    </div>
    <div class="h-[calc(100%-58px)]">
      <el-table :data="tableData" style="width: 100%; height: 100%">
        <template v-for="item in eventQueryTableColumn" :key="item.prop">
          <el-table-column v-bind="item" />
        </template>
        <template #empty class="empty">
          <el-empty
            :image="theme === 'light' ? emptyImgUrl[0] : emptyImgUrl[1]"
            :image-size="180"
          ></el-empty>
        </template>
      </el-table>
      <el-pagination
        class="fr"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";
import { eventQueryTableColumn } from "./rules";

const searchValue = ref<string>("");
function searchChannel() {}

const eventTypeValue = ref<number>(0);
const eventTypeOption = ref<{ id: number; name: string }[]>([
  { id: 0, name: "全部" },
  { id: 1, name: "模拟量" },
  { id: 2, name: "开关量" },
]);
function changeEventType(val: number) {}

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
function changeAlarmLevelOptions() {}

const datetimerange = ref<any[]>([
  new Date().getTime() - 3600 * 1000 * 24 * 1,
  new Date().getTime(),
]);
const shortcuts = [
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "近一月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "近一年",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now() + 3600 * 1000 * 24 * 1;
};

const tableData = ref<object[]>([]);
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();

function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
}
function currentChange(val: number) {
  currentPage.value = val;
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
</script>
<style scoped lang="scss"></style>
