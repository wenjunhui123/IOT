import type { FormRules } from "element-plus";
export const tableColumn = ref([
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "测量参数",
    prop: "para_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
  },
  {
    label: "告警分类",
    prop: "event_type",
    align: "center",
    minWidth: "140px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[rgba(255,193,104,0.1)] text-[#FFC168] leading-[30px]">
            设备定值越限
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[#E4F1FF] text-[#00A2FF] leading-[30px]">
            开关量变位
          </span>
        );
      } else if (cellValue === 3) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            上位机模拟量越限
          </span>
        );
      } else if (cellValue === 4) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            上位机统计量越限
          </span>
        );
      } else if (cellValue === 5) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            模拟量枚举值越限
          </span>
        );
      } else if (cellValue === 6) {
        return (
          <span class="round-[3px] inline-block  px-2 bg-[rgba(142,67,231,0.1)] text-[#8E43E7] leading-[30px]">
            开关量枚举值越限
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "告警级别",
    prop: "event_level",
    align: "center",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      const arr = ["其它事件", "事故", "告警", "一般", "预警"];
      if (cellValue === 1) {
        return (
          <span class="round-[3px] inline-block   px-2 bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            其它
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] inline-block   px-2 bg-[#FEEFEF] text-[#F95E5A] leading-[30px]">
            事故
          </span>
        );
      } else if (cellValue === 3) {
        return (
          <span class="round-[3px] inline-block   px-2 bg-[rgba(252,185,44,0.1)] text-[#FCB92C] leading-[30px]">
            报警
          </span>
        );
      } else if (cellValue === 4) {
        return (
          <span class="round-[3px] inline-block   px-2 bg-[#E4F1FF] text-[#00A2FF] leading-[30px]">
            一般
          </span>
        );
      } else if (cellValue === 5) {
        return (
          <span class="round-[3px] inline-block   px-2 bg-[rgba(41,176,97,0.1)] text-[#29B061] leading-[30px]">
            预警
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "动作类型",
    prop: "action_type",
    align: "left",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (row.event_type === 2) {
        if (cellValue === 2) {
          return (
            <span class="round-[3px] inline-block px-2  px-2 bg-[#EAF7EF] text-[#29B061] leading-[30px]">
              打开
            </span>
          );
        } else if (cellValue === 1) {
          return (
            <span class="round-[3px] inline-block px-2  px-2 bg-[#FEEFEF] text-[#F95E5A] leading-[30px]">
              闭合
            </span>
          );
        } else {
          return "--";
        }
      } else if (row.event_type === 3) {
        if (cellValue === 1) {
          return (
            <span class="round-[3px] inline-block px-2 px-2 bg-[#EAF7EF] text-[#29B061] leading-[30px]">
              越上限
            </span>
          );
        } else if (cellValue === 2) {
          return (
            <span class="round-[3px] inline-block px-2 px-2 bg-[#FEEFEF] text-[#F95E5A] leading-[30px]">
              越下限
            </span>
          );
        } else {
          return "--";
        }
      } else if (row.event_type === 5) {
        if (cellValue === 1) {
          return (
            <span class="round-[3px] inline-block px-2  px-2 bg-[#EAF7EF] text-[#29B061] leading-[30px]">
              越上限
            </span>
          );
        } else {
          return "--";
        }
      } else {
        return "--";
      }
    },
  },
  {
    label: "上限值",
    prop: "param1",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "下限值",
    prop: "param2",
    align: "left",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "动作延时(秒)",
    prop: "action_delay",
    align: "left",
    minWidth: "120px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "返回延时(秒)",
    prop: "return_delay",
    align: "left",
    minWidth: "120px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
]);

export interface AlarmClassfication {
  id: number;
  name: string;
}

export interface MeasurePoints {
  id: number;
  name: string;
}

export interface AlarmTemplate {
  id: number;
  name: string;
  is_release: boolean;
  isChecked: boolean;
}

interface AlarmTemplateForm {
  id: number;
  name: string;
  isChecked: boolean;
}

export const snapshotColumn = [
  {
    type: "selection",
    minWidth: "50px",
    align: "center",
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "120px",
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "120px",
  },
];

export const snapshotDeviceColumn = [
  {
    type: "selection",
    minWidth: "50px",
    align: "center",
  },
  {
    type: "index",
    label: "序号",
    minWidth: "120px",
    align: "left",
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "120px",
  },
];

export const AlarmTemplateFormRules = reactive<FormRules<AlarmTemplateForm>>({
  name: [
    {
      required: true,
      message: "请输入模板名称",
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
});

export interface AlarmForm {
  para_name?: string;
  event_id?: number;
  event_type?: number;
  event_level?: number;
  action_type?: number;
  param1?: number;
  param2?: number;
  action_delay?: number;
  return_delay?: number;
  event_desc: string;
  para?: number[] | number;
  need_save: boolean;
}

export const AlarmFormRules = reactive<FormRules<AlarmForm>>({
  para: [
    {
      required: true,
      message: "请选择测点",
      trigger: ["blur", "change"],
    },
  ],
  event_type: [
    {
      required: true,
      message: "请选择告警类型",
      trigger: ["blur", "change"],
    },
  ],
  event_level: [
    {
      required: true,
      message: "请选择告警级别",
      trigger: ["blur", "change"],
    },
  ],
  action_type: [
    {
      required: true,
      message: "请选择动作类型",
      trigger: ["blur", "change"],
    },
  ],
  event_desc: [
    {
      required: true,
      message: "请输入告警描述",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9~!@#%$^*()_+=[\]{}|\\,.?: -]{1,120}$/,
      message: "输入内容在1~120个字符",
      trigger: ["blur", "change"],
    },
  ],
  param1: [
    {
      required: true,
      message: "请输入上限值",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?|0$/,
      message: "只能输入大于等于0且不超过两位小数的数",
      trigger: ["blur", "change"],
    },
  ],
  param2: [
    {
      required: true,
      message: "请输入下限值",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?|0$/,
      message: "只能输入大于等于0且不超过两位小数的数",
      trigger: ["blur", "change"],
    },
  ],
  action_delay: [
    {
      required: true,
      message: "请输入动作延时",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^(0|[1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
      message: "输入0或小于65536的正整数",
      trigger: ["blur", "change"],
    },
  ],
  return_delay: [
    {
      required: true,
      message: "请输入返回延时",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^(0|[1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
      message: "输入0或小于65536的正整数",
      trigger: ["blur", "change"],
    },
  ],
});
