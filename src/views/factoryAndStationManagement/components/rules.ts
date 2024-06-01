import type { FormRules } from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";

export interface paginationType {
  pageSizes: number[];
  pageSize: number;
  currentPage: number;
  total: number;
  layout: string;
}


export const tableColumn = ref([
    {
      label: "ID",
      prop: "nodeId",
      minWidth: "100px",
      align: "left",
    },
    {
        label: "厂站名称",
        prop: "nodeName",
        align: "left",
        "show-overflow-tooltip": "true",
        minWidth: "150px",
    }
]);
  
interface RuleForm {
    nodeName: string;
}
  
export interface DialogModel {
    nodeName: string;
    nodeId:number
}
  
export const createOrEditFormRules = reactive<FormRules<RuleForm>>({
    nodeName: [
      {
        required: true,
        message: "请输入厂站名称",
        trigger: "blur",
      },
      {
        pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
        message: "请不要输入特殊字符",
        trigger: ["blur", "change"],
      },]
  });