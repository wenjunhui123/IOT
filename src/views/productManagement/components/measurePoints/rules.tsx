import type { FormRules } from "element-plus";

export const measurePointsMainTableColumn = [
    {
        type: 'index',
        label: "序号",
        minWidth: '80px',
        align:'center'
    },
  {
    label: "测点类型",
    prop: "property_type",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "模拟量";
      } else if (cellValue === 2) {
        return "开关量";
      } else {
        return "--";
      }
    },
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "数据定义",
    prop: "property_option",
    "show-overflow-tooltip": "true",
    align: "left",
    minWidth: "200px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (row.property_type === 1) {
        return row.property_option.unit? `取值范围：${cellValue.min}-${cellValue.max}`+  `  单位:${row.property_option.unit}`:`取值范围：${cellValue.min}-${cellValue.max}`;
      } else if (row.property_type === 2) {
        return cellValue.reverse ? "反转状态：反转" + '': "反转状态：未反转";
      } else {
        return "--";
      }
    },
  }
];

export const measurePointsMainTableSwitchColumn = [
    {
        type: 'index',
        label: "序号",
        minWidth: '80px',
        align:'center'
    },
  {
    label: "测点类型",
    prop: "property_type",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "模拟量";
      } else if (cellValue === 2) {
        return "开关量";
      } else {
        return "--";
      }
    },
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "反转开关",
    prop: "property_option.reverse",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return "开启";
      } else {
        return "关闭";
      }
    },
  },
];

export const measurePointsMainTableSimulationColumn = [
    {
        type: 'index',
        label: "序号",
        minWidth: '80px',
        align:'center'
    },
  {
    label: "测点类型",
    prop: "property_type",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "模拟量";
      } else if (cellValue === 2) {
        return "开关量";
      } else {
        return "--";
      }
    },
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "数据定义",
    prop: "property_option",
    "show-overflow-tooltip": "true",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (
        cellValue.min ||
        cellValue.min === 0 ||
        cellValue.max ||
        cellValue.max === 0
      ) {
        return `取值范围：${cellValue.min}-${cellValue.max}`;
      } else {
        return "--";
      }
    },
  },
  {
    label: "单位",
    prop: "property_option.unit",
    align: "left",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export const snapshotColumn = ref([
  {
    type: "selection",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "参数ID",
    prop: "data_id",
    minWidth: "100px",
    align: "left",
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "120px",
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "120px",
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "120px",
  },
]);

interface MeasurePointsRuleForm {
  property_id?: number;
  property_name: string;
  property_type: number;
  para_handle: number;
  data_id?: number | string;
  data_name?: string;
  logical_id: number;
  property_option?: {
    min?: number;
    max?: number;
    amp?: number;
    div?: number;
    reverse?: number;
    scaling_factor?: number;
    unit?: string;
  };
}

export interface SnapshotTableRuleForm {
  loggingInterval: number | string;
}

export const MeasurePointsRuleFormRules = reactive<
  FormRules<MeasurePointsRuleForm>
>({
  property_type: [
    {
      required: true,
      message: "请选择测点类型",
      trigger: ["blur", "change"],
    },
  ],
  property_name: [
    {
      required: true,
      message: "请输入测点名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9~!@#$^*()_+=[\]{}|\\,.?: -]{1,125}$/,
        message: "输入内容在1~125个字符",
        trigger: ["blur", "change"],
      },
  ],
  para_handle: [
    {
      required: true,
      message: "请输入参数号",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入零或正整数",
      trigger: ["blur", "change"],
    },
  ],
  logical_id: [
    {
      required: false,
      message: "请输入回路号",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入零或正整数",
      trigger: ["blur", "change"],
    },
  ],
  "property_option.min": [
    {
      required: false,
      message: "请输入最小值",
      trigger: ["blur", "change"],
    },
  ],
  "property_option.max": [
    {
      required: false,
      message: "请输入最大值",
      trigger: ["blur", "change"],
    },
  ],
});

export const SnapshotTableRuleFormRules = reactive<
  FormRules<SnapshotTableRuleForm>
>({});
