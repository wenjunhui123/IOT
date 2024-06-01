<template>
  <el-dialog
    custom-class="productManagement-preferencesPage important-rounded-[12px]"
    append-to-body
    :title="dialogConfig.title"
    :width="dialogConfig.width"
    :close-on-click-modal="false"
    v-model="show"
    ><div
      class="box-border w-[1044px] h-[668px] px-6 py-4 bg-BG1 rounded-lg mb-[10px]"
    >
      <div class="h-full flex" :gutter="20">
        <div class="important-w-[362px] border-r-1 border-BG3 box-border pr-6">
          <div class="font-medium important-w-[338px] text-T1 mb-4">
            基础信息
          </div>
          <!-- <el-input
            class="mb-4 important-w-[338px]"
            size="small"
            placeholder="请输入关键字"
            :suffix-icon="Search"
            v-model="baseFilterText"
            clearable
          ></el-input> -->
          <el-tree
            v-if="isShowTree"
            ref="treeRef"
            class="filter-tree preferencesPage-tree important-w-[338px] h-[calc(100%-50px)] overflow-y-auto"
            :highlight-current="true"
            :props="defaultProps"
            :current-node-key="currentNode.menu_id"
            node-key="menu_id"
            :load="loadNode"
            lazy
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          />
        </div>
        <div class="flex-1 pl-6">
          <div class="font-medium text-T1 mb-4">选择参数</div>
          <el-input
            class="mb-4 important-w-[392px]"
            size="small"
            placeholder="请输入关键字"
            :suffix-icon="Search"
            v-model="paramsFilterText"
            @blur="changeParamsFilter"
            clearable
          ></el-input>
          <el-table
            class="important-w-[610px] important-h-[calc(100%-152px)]"
            highlight-current-row
            :data="tableData"
            @current-change="handleCurrentChange"
          >
            <el-table-column label="参数名称" prop="data_name" />
            <el-table-column label="参数ID" prop="data_id" />
          </el-table>
          <el-pagination
            class="pt-6 fr important-w-[610px]"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :layout="layout"
            :total="totalCount"
            popper-class="deviceInstantiation-page"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { FormInstance } from "element-plus";
import { ElTree } from "element-plus";
import { usePagination } from "@/utils/hook/pagination";
import { getDataMenu, getDataID } from "@/api/productManage/index";
import type {
  DataMenuResponse,
  DataIdResponse,
} from "@/api/productManage/types";

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
    measureType: number;
  }>(),
  {
    modelValue: false,
    measureType: 0,
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
  title: "参数选择",
  width: "1060px",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        emptyData();
        refreshtreeTable();
      });
    }
  },
  { immediate: true, deep: true }
);

const ruleFormRef = ref<FormInstance>();
/* 表单数据模块 */
const model = reactive({});

const baseFilterText = ref("");
watch(baseFilterText, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

interface Tree {
  [key: string]: any;
}
interface DataTree {
  menu_id: number;
  menu_name: string;
  is_leaf: boolean;
  children?: DataTree[] | undefined;
}

const treeRef = ref<InstanceType<typeof ElTree>>();
const defaultProps = {
  children: "children",
  label: "menu_name",
  value: "menu_id",
  isLeaf: "is_leaf",
};
const isShowTree = ref<boolean>(true);
const currentNode = ref<any>({
  menu_id: 0,
  menu_name: "全部",
  is_leaf: false,
  children: [],
});
function nodeClick(item: any) {
  currentNode.value = item;
  currentPage.value = 1;
  pageSize.value = 10;
  tableData.value = [];
  totalCount.value = 0;
  currentRow.value = { data_name: "", data_id: 0 };
  //   if (item.is_leaf) {
  queryDataID();
  //   }
}
const loadNode = async (node: Node, resolve: (data: DataTree[]) => void) => {
  pageSize.value = 10;
  currentPage.value = 1;
  if (node.level === 0) {
    return resolve([
      {
        menu_id: 0,
        menu_name: "全部",
        is_leaf: false,
        children: [],
      },
    ]);
  } else if (!node.data.is_leaf) {
    const treeData = await queryDataMenu(node.data);
    resolve(treeData);
  }
};
async function refreshtreeTable() {
  currentNode.value = {
    menu_id: 0,
    menu_name: "全部",
    is_leaf: false,
    children: [],
  };
  isShowTree.value = false;
  nextTick(() => {
    isShowTree.value = true;
    queryDataID();
  });
}

const paramsFilterText = ref("");
function changeParamsFilter() {
  currentPage.value = 1;
  queryDataID();
}
const tableData = ref<{ data_name: string; data_id: number }[]>([]);
async function queryDataMenu(node: any) {
  const res = await getDataMenu(node.menu_id, props.measureType);
  if (res.code === 0 && res.data.length) {
    return res.data.map((item) => {
      const data = {
        menu_id: item.menu_id,
        menu_name: item.menu_name,
        is_leaf: item.is_leaf,
        children: item.is_leaf ? undefined : [],
      };
      node.children.push(data);
      return data;
    });
  } else {
    return [];
  }
}

const currentRow = ref<{ data_name: string; data_id: number }>({
  data_name: "",
  data_id: 0,
});
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !paramsFilterText.value ||
      data.data_name
        .toLowerCase()
        .includes(paramsFilterText.value.toLowerCase())
  )
);
const handleCurrentChange = (val: any) => {
  currentRow.value = val;
};
const { currentPage, pageSize, pageSizes, layout, totalCount } =
  usePagination();
function sizeChange(val: number) {
  currentPage.value = 1;
  pageSize.value = val;
  queryDataID();
}
async function currentChange(val: number) {
  currentPage.value = val;
  queryDataID();
}
async function queryDataID() {
  const param = {
    id: currentNode.value.menu_id,
    page_size: pageSize.value,
    page: currentPage.value,
    key_word: paramsFilterText.value,
    property_type: !currentNode.value.menu_id ? props.measureType : undefined,
  };
  const res: UniversalReponse<DataIdResponse[]> = await getDataID(param);
  if (res.code === 0 && res.data?.length) {
    totalCount.value = res.total as number;
    tableData.value = res.data;
  } else {
    totalCount.value = 0;
    tableData.value = [];
  }
}

/* 表单上传模块 */
async function confirm(formEl: FormInstance | undefined) {
  if (currentRow?.value?.data_id && currentRow?.value?.data_name) {
    emit("ok", {
      data_id: currentRow.value.data_id,
      data_name: currentRow.value.data_name,
    });
    show.value = false;
  } else {
    ElMessage.warning("请选择参数");
  }
}
function cancel() {
  show.value = false;
}

function emptyData() {
  baseFilterText.value = "";
  paramsFilterText.value = "";
  totalCount.value = 0;
  tableData.value = [];
  currentRow.value = { data_name: "", data_id: 0 };
  currentNode.value = {
    menu_id: 0,
    menu_name: "全部",
    is_leaf: false,
    children: [],
  };
}
</script>
<style lang="scss">
.productManagement-preferencesPage {
  margin: 6vh auto;
  .el-dialog__body {
    padding: 8px !important;
    @include background_color(BG);
    .el-icon {
      width: 2em;
    }
  }
  .preferencesPage-tree {
    :deep(.el-tree-node__content > .el-tree-node__expand-icon) {
      padding: 2px;
    }
    :deep(.el-tree-node:focus > .el-tree-node__content) {
      @include background_color(BG4);
    }
    :deep(.el-tree-node__content) {
      &:hover {
        @include background_color(BG4);
      }
    }
  }
}
</style>
