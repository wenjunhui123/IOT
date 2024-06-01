import type { FormRules } from "element-plus";

export const tableColumn = ref([
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "遥控点名称",
    prop: "service_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "100px",
  },
  {
    label: "动作类型",
    prop: "action_type",
    align: "center",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return (
          <span class="round-[3px] inline-block w-[52px] h-[28px] bg-[#FEEFEF] text-Sta3 leading-[30px]">
            闭合
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] inline-block w-[52px] h-[28px] bg-BG4 text-Sta1 leading-[30px]">
            打开
          </span>
        );
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
    label: "参数ID",
    prop: "data_id",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "150px",
  },
]);

interface RemoteControlRuleForm {
  service_name: string;
  service_id?: number;
  action_type: number;
  para_handle: number;
  data_id?: number;
  logical_id?: number;
}

export const RemoteControlRuleFormRules = reactive<
  FormRules<RemoteControlRuleForm>
>({
  service_name: [
    {
      required: true,
      message: "请输入遥控点名称",
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
  action_type: [
    {
      required: true,
      message: "请选择动作类型",
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
      message: "只能输入整数",
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
      message: "只能输入整数",
      trigger: ["blur", "change"],
    },
  ],
});
