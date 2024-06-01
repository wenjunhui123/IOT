<template>
  <div class="h-full">
    <div class="w-full mb-4 h-[56px] flex justify-between">
      <div class="w-[240px] mr-6" v-if="false">
        <div class="mb-1 text-[14px]">数据映射方案</div>
        <el-select
          v-model="dataMappingSchemeValue"
          placeholder="请选择数据映射方案"
          clearable
          @change="changeDataMappingScheme"
        >
          <el-option
            v-for="item in dataMappingSchemeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="w-[240px] mr-6" v-if="false">
        <div class="mb-1 text-[14px]">参数映射方案</div>
        <el-select
          v-model="parameterMappingSchemeValue"
          placeholder="请选择参数映射方案"
          clearable
          @change="changeParameterMappingScheme"
        >
          <el-option
            v-for="item in parameterMappingSchemeOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="w-[240px] mr-6">
        <div class="mb-1 text-[14px]">关联DrvCfg</div>
        <el-select
          v-model="associateDrvCfgValue"
          placeholder="请选择关联DrvCfg"
          clearable
          @change="changeAssociateDrvCfg"
        >
          <el-option
            v-for="item in associateDrvCfgOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="mt-[12px]">
        <el-button class="float-right" type="primary">编辑</el-button>
        <el-button class="float-right mr-3">查看</el-button>
      </div>
    </div>
    <div class="h-[calc(100%-72px)]">
      <div class="mb-1 text-[14px]">通用inf</div>
      <el-input
        class="universalInf h-[calc(100%-26px)]"
        resize="none"
        v-model="universalInf"
        type="textarea"
        placeholder="请输入通用inf"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { getCommConfig, putCommConfig } from "@/api/productManage/index";
import type { ProductConfigurationResponse } from "@/api/productManage/types";

const productId: any = inject<number>("productId");
watch(
  () => productId,
  (val: Ref) => {
    if (val.value) {
      nextTick(() => {
        queryCommConfig();
      });
    }
  },
  { immediate: true, deep: true }
);

const dataMappingSchemeValue = ref<number>();
const dataMappingSchemeOption = ref<{ id: number; name: string }[]>([
  { id: 1, name: "PMC-53A-V5.0" },
]);
function changeDataMappingScheme(val: number) {}

const parameterMappingSchemeValue = ref<number>();
const parameterMappingSchemeOption = ref<{ id: number; name: string }[]>([]);
function changeParameterMappingScheme() {}

const associateDrvCfgValue = ref<number>();
const associateDrvCfgOption = ref<{ id: number; name: string }[]>([]);
function changeAssociateDrvCfg() {}

const universalInf = ref<string>("");

async function queryCommConfig() {
  const res: UniversalReponse<ProductConfigurationResponse> =
    await getCommConfig(productId.value);
  if (res.code === 0) {
    universalInf.value = res.data.common_inf;
    parameterMappingSchemeValue.value = res.data.config_id
      ? res.data.config_id
      : undefined;
  }
}
</script>
<style lang="scss" scoped>
.universalInf {
  :deep(.el-textarea__inner) {
    height: 100% !important;
  }
}
</style>
