<template>
  <el-dialog
    class="systemNetworkNodeManagement-createOrEditPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
  >
    <el-form
      ref="ruleFormRef"
      class="bg-BG createOrEditForm"
      label-position="top"
      :model="model"
      :rules="createOrEditFormRules"
    >
      <div class="p-6 bg-BG1 rounded-lg mb-[10px]">
        <div class="font-bold text-T1">基本信息</div>
        <el-row :gutter="20" class="mt-4 important-h-[144px]">
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="节点名称"
              prop="nodeName"
            >
              <el-input v-model="model.nodeName" placeholder="请输入节点名称" />
            </el-form-item>
            <el-form-item class="important-h-[64px]" label="IP" prop="ipaddr1">
              <el-input v-model="model.ipaddr1" placeholder="请输入IP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="important-h-[64px]"
              label="计算机名称"
              prop="computerName"
            >
              <el-input
                v-model="model.computerName"
                placeholder="请输入计算机名称"
              />
            </el-form-item>
            <el-form-item
              class="important-h-[64px]"
              label="备用IP"
              prop="ipaddr2"
            >
              <el-input v-model="model.ipaddr2" placeholder="请输入备用IP" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="p-6 bg-BG1 rounded-lg flex flex-wrap">
        <div class="font-bold text-T1 w-full">节点类型</div>
        <div class="w-full important-h-[56px] mt-4 border-b-[1px] border-B2">
          <el-radio-group
            v-model="model.timeServer"
            class="ml-4 flex justify-between"
          >
            <el-radio
              class="w-[160px]"
              label="时间服务器"
              size="large"
              @click.native.prevent="selectNode('timeServer', '时间服务器')"
              >时间服务器</el-radio
            >
            <el-radio
              class="w-[160px]"
              label="备用时间服务器"
              size="large"
              @click.native.prevent="selectNode('timeServer', '备用时间服务器')"
              >备用时间服务器</el-radio
            >
          </el-radio-group>
        </div>
        <div class="w-full important-h-[56px] mt-4 border-b-[1px] border-B2">
          <el-radio-group
            v-model="model.configServer"
            class="ml-4 flex justify-between"
          >
            <el-radio
              class="w-[160px]"
              label="configServer"
              size="large"
              @click.native.prevent="selectNode('configServer', 'configServer')"
              >configServer</el-radio
            >
            <el-radio
              class="w-[160px]"
              label="备用configServer"
              size="large"
              @click.native.prevent="
                selectNode('configServer', '备用configServer')
              "
              >备用configServer</el-radio
            >
          </el-radio-group>
        </div>

        <div class="w-full important-h-[56px] mt-4 border-b-[1px] border-B2">
          <el-radio-group
            v-model="model.frontDesk"
            class="ml-4 flex justify-between"
          >
            <el-radio
              class="w-[160px]"
              label="前台"
              size="large"
              @click.native.prevent="selectNode('frontDesk', '前台')"
              >前台</el-radio
            >
            <el-radio
              class="w-[120px]"
              label="备用前台"
              size="large"
              @click.native.prevent="selectNode('frontDesk', '备用前台')"
              >备用前台</el-radio
            >
            <div class="box-border w-[130px] pl-4">
              <el-form-item
                class="important-h-[28px] important-w-[180px] pt-2"
                label=""
                prop="staId"
              >
                <el-select
                  v-model="model.staId"
                  :disabled="!model.frontDesk"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.nodeId"
                    :label="item.nodeName"
                    :value="item.nodeId"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-radio-group>
        </div>
        <div class="w-full important-h-[56px] leading-[56px] mt-4 select-none">
          <el-radio-group
            v-model="model.backstage"
            class="ml-4 flex justify-between"
          >
            <el-radio
              class="w-[160px]"
              label="后台"
              size="large"
              @click.native.prevent="selectNode('backstage', '后台')"
              >后台</el-radio
            ></el-radio-group
          >
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
import type { DialogModel, OptionType, NetworkParams } from "./rules";
import { createOrEditFormRules, typeList } from "./rules";
import type { FormInstance } from "element-plus";
import {
  getIdNetworkNode,
  addOrUpdateNetWork,
} from "@/api/systemNetwork/index";
import { getNetworkNodes } from "@/api/stationnodes/index";

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
    isEdit: boolean;
    nodeId: number;
  }>(),
  {
    modelValue: false,
    isEdit: false,
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
  title: "新建节点",
  width: "640px",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        if (!props.isEdit) {
          emptyData(ruleFormRef.value);
          dialogConfig.title = "新建节点";
        } else if (props.isEdit) {
          dialogConfig.title = "编辑节点";
          if (props.nodeId !== currentId.value) {
            emptyData(ruleFormRef.value);
            queryIdNetworkNode(props.nodeId);
          }
        }
      });
    }
  },
  {
    immediate: true,
  }
);

const currentId = ref<number>(0);
const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = reactive<DialogModel>({
  nodeName: "",
  computerName: "",
  ipaddr1: "",
  ipaddr2: "",
  timeServer: "",
  configServer: "",
  backstage: "",
  frontDesk: "",
  staId: "",
});

watch(
  () => model.frontDesk,
  (val) => {
    if (val) {
      (createOrEditFormRules as any).staId[0].required = true;
    } else {
      (createOrEditFormRules as any).staId[0].required = false;
      model.staId = "";
    }
  }
);

const options = ref<OptionType[]>([]);

async function init() {
  const res = await getNetworkNodes();
  if (res.code === 0 && res.data.length) {
    options.value = res.data;
  }
}

function selectNode<T extends keyof DialogModel>(key: T, currentValue: string) {
  if (model[key] === currentValue) {
    (model as any)[key] = "";
  } else {
    (model as any)[key] = currentValue;
  }
}

/* 查询详情接口 */
async function queryIdNetworkNode(id: number) {
  const res: any = await getIdNetworkNode(id);
  if (res.code === 0 && res.data) {
    for (let key in res.data) {
      if (key in model) {
        (model as any)[key] = res.data[key];
      } else if (key === "typeList") {
        res.data[key].forEach((ele: string) => {
          if (["时间服务器", "备用时间服务器"].includes(ele)) {
            model.timeServer = ele;
          } else if (["前台", "备用前台"].includes(ele)) {
            model.frontDesk = ele;
          } else if (["configServer", "备用configServer"].includes(ele)) {
            model.configServer = ele;
          } else if (["后台"].includes(ele)) {
            model.backstage = ele;
          }
        });
      }
    }
    if (!model.staId) {
      model.staId = "";
    }
  }
}

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const param: NetworkParams = {
        nodeName: model.nodeName,
        computerName: model.computerName,
        ipaddr1: model.ipaddr1,
        ipaddr2: model.ipaddr2,
        staId: model.staId && model.frontDesk ? Number(model.staId + "") : 0,
        netWorkNodeType: [],
      };
      const keyName = ["timeServer", "frontDesk", "configServer", "backstage"];
      keyName.forEach((name) => {
        typeList.forEach((item, index) => {
          if ((model as any)[name] === item) {
            param.netWorkNodeType.push(index + 1);
          }
        });
      });
      param.nodeId = props.isEdit ? props.nodeId : 0;
      const res = await addOrUpdateNetWork(param);
      if (res.code === 0) {
        if (props.isEdit) {
          ElMessage.success("编辑成功");
        } else {
          ElMessage.success("新建成功");
        }
        show.value = false;
        emit("ok");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
}
function cancel() {
  show.value = false;
}

// 表单清空
function emptyData(formEl: FormInstance | undefined) {
  init();
  formEl?.clearValidate();
  let key: keyof DialogModel;
  for (key in model) {
    (model as any)[key] = "";
  }
}
</script>
<style lang="scss">
.systemNetworkNodeManagement-createOrEditPage {
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
  }

  .createOrEditForm {
    .el-form-item {
      margin-bottom: 16px;

      .el-form-item__label {
        @include font_color("T1");
        padding: 0 !important;
        line-height: 20px !important;
      }
    }

    .isCheck {
      @include border_color("ZS");
    }

    .backstage {
      @include border_color("ZS");
      color: var(--el-color-primary);
    }
  }
}
</style>
