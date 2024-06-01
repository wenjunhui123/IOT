<template>
  <el-dialog
    class="gatewayManagement-createOrEditGatewayPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  ><el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditGatewayForm"
      label-position="top"
      :model="model"
      :rules="CreateOrEditGatewayRuleFromRules"
    >
      <div class="px-6 py-4 bg-BG1 rounded-lg">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="网关名称"
              prop="gateway_name"
            >
              <el-input v-model="model.gateway_name">
              </el-input>
            </el-form-item>
            <el-form-item
              label="同步方式"
              prop="sync_way"
            >
              <el-select
                class="w-full"
                v-model="model.sync_way"
                disabled
              >
                <el-option
                  v-for="item in sync_wayOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主IP"
              prop="primary_ip"
            >
              <el-input v-model="model.primary_ip">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="网关型号"
              prop="gateway_model"
            >
              <el-select
                class="w-full"
                v-model="model.gateway_model"
                :disabled="props.infoType===`edit`"
              >
                <el-option
                  v-for="item in gateway_typeOptions"
                  :key="item.GatewayModel"
                  :label="item.GatewayModelName"
                  :value="item.GatewayModel"
                ></el-option>
              </el-select></el-form-item>
            <el-form-item
              label="关联厂站"
              prop="station_id"
            ><el-select
                class="w-full"
                v-model="model.station_id"
                :disabled="props.infoType===`edit`"
              >
                <el-option
                  v-for="item in station_nodeOptions"
                  :key="item.nodeId"
                  :label="item.nodeName"
                  :value="item.nodeId"
                ></el-option>
              </el-select></el-form-item>
            <el-form-item
              label="备IP"
              prop="standby_ip"
            >
              <el-input v-model="model.standby_ip">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button
        type="primary"
        @click="confirm(ruleFormRef)"
      >确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { CreateOrEditGatewayRuleFromRules } from "./rules";
import type { CreateOrEditGatewayRuleFrom } from "./rules";
import { reactive, ref } from "vue";
import {
  editGateway,
  addGateway,
  getStationList,
  getGatewayModelList,
  getSingleGateway,
} from "@/api/gatewayManage";
import type { StationResponse } from "@/api/gatewayManage/type";

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
    infoType: string;
    currentNode: any;
  }>(),
  {
    modelValue: false,
    infoType: "create",
    currentNode: null,
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
  title: "新增网关",
  width: "640px",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        emptyData();
        getStationOptions();
        getGatewayModelOptions();
        if (props.infoType === "edit") {
          dialogConfig.title = "编辑网关";
          getCyrGateway();
          // model.value = props.currentNode;
        } else if (props.infoType === "create") {
          dialogConfig.title = "新增网关";
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = ref<CreateOrEditGatewayRuleFrom>({
  gateway_id: undefined,
  gateway_name: "",
  gateway_model: undefined,
  sync_way: 1,
  primary_ip: "",
  standby_ip: "",
  station_id: undefined,
});
const sync_wayOptions = ref<any>([
  { id: 1, name: "本地" },
  { id: 2, name: "远程" },
]);
const gateway_typeOptions = ref<any>([]);
const station_nodeOptions = ref<any>([]);

async function getCyrGateway() {
  const res: UniversalReponse<StationResponse[]> = await getSingleGateway(
    props.currentNode.gateway_id
  );
  if (res.code === 0) {
    model.value = res.data;
  }
}

function cancel() {
  show.value = false;
}
function confirm(ruleFormRef) {
  if (!ruleFormRef) return;
  ruleFormRef.validate(async (valid) => {
    if (valid) {
      if (props.infoType === "create") {
        const res: UniversalReponse = await addGateway(model.value);
        if (res.code === 0) {
          show.value = false;
          ElMessage.success("新增成功");
          emit("success");
        }
      } else {
        let param = {
          gateway_name: model.value.gateway_name,
          primary_ip: model.value.primary_ip,
          standby_ip: model.value.standby_ip,
        };
        const response: UniversalReponse = await editGateway(
          param,
          model.value.gateway_id
        );
        if (response.code === 0) {
          show.value = false;
          ElMessage.success("编辑成功");
          emit("success");
        }
      }
    }
  });
}
async function getStationOptions() {
  const res: UniversalReponse<StationResponse[]> = await getStationList();
  if (res.code === 0 && res.data?.length) {
    station_nodeOptions.value = res.data;
  } else {
    station_nodeOptions.value = [];
  }
}
async function getGatewayModelOptions() {
  const res: UniversalReponse<any[]> = await getGatewayModelList();
  if (res.code === 0 && res.data?.length) {
    gateway_typeOptions.value = res.data;
  }
}
// 表单清空
function emptyData() {
  model.value.gateway_id = undefined;
  model.value.gateway_name = "";
  model.value.gateway_model = undefined;
  model.value.sync_way = 1;
  model.value.primary_ip = "";
  model.value.standby_ip = "";
  model.value.station_id = undefined;
}
</script>
<style lang="scss">
.gatewayManagement-createOrEditGatewayPage {
  margin-top: 6vh;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }
  .createOrEditGatewayForm {
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
    }
    .el-input-number.is-without-controls .el-input__wrapper {
      width: 100% !important;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
