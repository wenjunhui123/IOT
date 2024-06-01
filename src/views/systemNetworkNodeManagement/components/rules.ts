import type { FormRules } from "element-plus";

export const typeList: string[] = [
  "时间服务器",
  "前台",
  "后台",
  "configServer",
  "备用时间服务器",
  "备用前台",
  "备用configServer",
];

export const tableColumn = ref([
  {
    label: "ID",
    prop: "nodeId",
    width: "80px",
    align: "left",
  },
  {
    label: "节点名称",
    prop: "nodeName",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "250px",
  },
  {
    label: "计算机名称",
    prop: "computerName",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "250px",
  },
  {
    label: "节点类型",
    prop: "typeList",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "250px",
    formatter: (row: any, column: any, cellValue: any, index: number) => {
      return cellValue?.reduce(
        (lastvalue: string, nowValue: string, index: number) => {
          if (index === 0) {
            return lastvalue + nowValue;
          } else {
            return lastvalue + "、" + nowValue;
          }
        },
        ""
      );
    },
  },
  {
    label: "IP",
    prop: "ipaddr",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: (row: any, column: any, cellValue: any, index: number) => {
      if (row.ipaddr1 && row.ipaddr2) {
        return row.ipaddr1 + "/" + row.ipaddr2;
      } else if (row.ipaddr1 && !row.ipaddr2) {
        return row.ipaddr1;
      } else if (!row.ipaddr1 && row.ipaddr2) {
        return row.ipaddr2;
      } else {
        return "--";
      }
    },
  },
]);

interface RuleForm {
  nodeName: string;
  computerName: string;
  ipaddr1: string;
  ipaddr2: string;
  staId: string;
}

export interface DialogModel {
  nodeName: string;
  computerName: string;
  ipaddr1: string;
  ipaddr2: string;
  timeServer: string;
  configServer: string;
  backstage: string;
  frontDesk: string;
  staId: number | string;
}

export const createOrEditFormRules = reactive<FormRules<RuleForm>>({
  nodeName: [
    {
      required: true,
      message: "请输入节点名称",
      trigger: "blur",
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
  ],
  computerName: [
    {
      required: true,
      message: "请输入计算机名称",
      trigger: "blur",
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
  ],
  ipaddr1: [
    {
      required: true,
      message: "请输入IP地址",
      trigger: "blur",
    },
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
  ipaddr2: [
    {
      required: false,
      message: "请输入IP地址",
      trigger: "blur",
    },
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
  staId: [
    {
      required: false,
      message: "请选择前台",
      trigger: ["blur", "change"],
    },
  ],
});

export interface OptionType {
  nodeId: number;
  nodeName: string;
  nodeType: number;
  parentNodeId: number;
  parentNodeType: number;
  updateTime: number;
    modelLabel_id?: string;
    children?:[]
}

export interface NetworkParams {
  nodeId?: number;
  nodeName: string;
  netWorkNodeType: number[];
  computerName: string;
  ipaddr1: string;
  ipaddr2: string;
  staId: number;
}
