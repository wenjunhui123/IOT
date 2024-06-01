<template>
  <el-dialog
    custom-class="dataDetails-trendCurvePage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <div class="h-full box-border px-6 py-3 bg-BG1 important-rounded-[4px]">
      <div class="w-full mt-2 mb-4 mb-4 flex justify-between">
        <div>
          <PesudoFormItem class="mr-4" label="分析周期">
            <el-select
              class="important-w-[100px]"
              v-model="analysisCycleValue"
              placeholder="请选择分析周期"
              @change="changeAnalysisCycleType"
            >
              <el-option
                v-for="item in analysisCycleOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </PesudoFormItem>
          <PesudoFormItem class="mr-4" label="日期">
            <el-date-picker
              class="important-w-[200px]"
              v-model="dateValue"
              type="date"
              :disabled-date="disabledDate"
              placeholder="选择日期"
            />
          </PesudoFormItem>
        </div>
        <el-radio-group
          v-model="curveType"
          label="趋势类型"
          @change="changeCurveType"
        >
          <el-radio-button value="curveTrend" label="curveTrend"
            >曲线</el-radio-button
          >
          <el-radio-button value="curveSheet" label="curveSheet"
            >表格</el-radio-button
          >
        </el-radio-group>
      </div>
      <el-checkbox-group
        class="w-full flex flex-row-reverse"
        v-model="trendCheck"
      >
        <el-checkbox
          class="important-mr-4"
          v-for="item in trendList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-checkbox-group>
      <div v-if="curveType === 'curveTrend'"></div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import PesudoFormItem from "@/components/pesudo-form-item.vue";
import { usePagination } from "@/utils/hook/pagination";
import { useSettingsStore } from "@/stores/modules/settings";

/*
事件定义
*/
const emit = defineEmits(["update:modelValue"]);

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

watch(
  () => props.modelValue,
  (val) => {}
);

const dialogConfig = reactive({
  title: "趋势曲线",
  width: "1080px",
});

/* 表单上传模块 */
async function confirm() {}
function cancel() {
  show.value = false;
}

const analysisCycleValue = ref<number>(1);
const analysisCycleOption = ref<{ id: number; name: string }[]>([
  { id: 1, name: "日" },
  { id: 2, name: "自定义" },
]);
function changeAnalysisCycleType(val: number) {}

const dateValue = ref(new Date().getTime());
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const curveType = ref<string>("curveTrend");
function changeCurveType(value: string | number | boolean) {}

const trendCheck = ref([]);
const trendList = ref([
  { label: "打点显示", value: "打点显示" },
  { label: "平均值", value: "平均值" },
  { label: "差值", value: "差值" },
  { label: "最值", value: "最值" },
]);
</script>
<style lang="scss">
.dataDetails-trendCurvePage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
}
</style>
