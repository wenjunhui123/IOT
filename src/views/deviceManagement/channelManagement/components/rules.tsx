import type { FormRules } from "element-plus";

export const tableColumn = ref([
  {
    label: "ID",
    prop: "nodeId",
    width: "80px",
    align: "left",
  },
  {
    label: "通道名称",
    prop: "nodeName",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "所属厂站",
    prop: "stationName",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "驱动类型",
    prop: "drvTypeName",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "巡检方式",
    prop: "portalMode",
    align: "center",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === "PARALLEL") {
        return (
          <span class="round-[3px] inline-block w-[40px] h-[28px] bg-BG4 text-Sta1 leading-[30px]">
            并行
          </span>
        );
      } else if (cellValue === "SERIAL") {
        return (
          <span class="round-[3px] inline-block w-[40px] h-[28px] bg-[rgba(0,162,255,0.1)] text-Sta4 leading-[30px]">
            串行
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "通信方式",
    prop: "portType",
    align: "center",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === "ETHERNET") {
        return (
          <span class="round-[3px] inline-block w-[52px] h-[28px] bg-[rgba(252,185,44,0.1)] text-Sta2 leading-[30px]">
            以太网
          </span>
        );
      } else if (cellValue === "COM") {
        return (
          <span class="round-[3px] inline-block w-[52px] h-[28px] bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            串口
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "通信地址",
    prop: "comAddr",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "200px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
]);

export const infoTableColumn = ref([
  {
    type: "index",
    label: "序号",
    with: "50px",
    align: "left",
  },
  {
    label: "配置项名称",
    prop: "name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
  },
  {
    label: "配置项类型",
    prop: "type",
    align: "left",
    minWidth: "100px",
  },
  {
    label: "配置项描述/说明",
    prop: "descript",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
]);

export interface BasicConfigModel {
  nodeName: string;
  drvType: number | string;
  portalMode: string;
  portType: string;
  stationId: number | string;
  adjustTimeInterval: number | string;
  transmitDelay: number | string;
  repeatTimes: number | string;
  writeConsoleInfo: number | string;
  writeDebugInfo: number | string;
  [key: string]: string | number;
}

export interface InfoConfigModel {
  nodeName: string;
  drvName: string;
  portalModeName: string;
  portTypeName: string;
  stationName: string;
  adjustTimeInterval: number | string;
  transmitDelay: number | string;
  repeatTimes: number | string;
  writeConsoleInfo: number | string;
  writeDebugInfo: number | string;
  [key: string]: string | number;
}

interface RuleForm {
  nodeName: string;
  drvType: string;
  portalMode: string;
  portType: string;
  stationId: string | number;
  port?: string | number;
  remoteAddr?: string;
  adjustTimeInterval: string | number;
  transmitDelay: number | string;
  repeatTimes: number | string;
  writeConsoleInfo: number | string;
  writeDebugInfo: number | string;
}

export interface InfValue {
  delete: boolean;
  section: string;
  key: string;
  value: string | number;
}

export const createOrEditFormRules = reactive<FormRules<RuleForm>>({
  nodeName: [
    {
      required: true,
      message: "请输入通道名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
  ],
  drvType: [
    {
      required: true,
      message: "请选择驱动类型",
      trigger: ["blur", "change"],
    },
  ],
  portalMode: [
    {
      required: true,
      message: "请选择巡检方式",
      trigger: ["blur", "change"],
    },
  ],
  portType: {
    required: false,
    message: "请选择通信方式",
    trigger: ["blur", "change"],
  },
  adjustTimeInterval: [
    {
      required: true,
      message: "请输入对时间隔",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入整数",
      trigger: ["blur", "change"],
    },
  ],
  transmitDelay: [
    {
      required: true,
      message: "请输入头字节等待时间",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入整数",
      trigger: ["blur", "change"],
    },
  ],
  repeatTimes: [
    {
      required: true,
      message: "请输入设备连续通信次数",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入整数",
      trigger: ["blur", "change"],
    },
  ],
  port: [
    {
      pattern: /^(0|[1-9][0-9]*)$/,
      message: "只能输入整数",
      trigger: ["blur", "change"],
    },
  ],
  stationId: [
    {
      required: true,
      message: "请选择前台厂站",
      trigger: ["blur", "change"],
    },
  ],
  remoteAddr: {
    pattern:
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, // 请输入域名
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
  },
});
