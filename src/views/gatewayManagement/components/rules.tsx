import type { FormRules } from "element-plus";
import moment from "moment";

export const mainTableColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "网关名称",
    prop: "gateway_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "网关型号",
    prop: "gateway_model_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "同步方式",
    prop: "sync_way",
    align: "left",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "本地";
      } else if (cellValue === 2) {
        return "远程";
      }
    },
  },
  {
    label: "主用IP",
    prop: "primary_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "备用IP",
    prop: "standby_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "厂站",
    prop: "station_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "组态同步状态",
    prop: "sync_status",
    align: "left",
    width: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return (
          <span class="round-[3px] box-border inline-block w-[60px] h-[28px] px-[8px] py-[4px] bg-[rgba(41,176,97,0.1)] text-[#29B061] leading-[20px]">
            已同步
          </span>
        );
      } else {
        return (
          <span class="round-[3px] box-border inline-block w-[60px] h-[28px] px-[8px] py-[4px] bg-[rgba(249,94,90,0.1)] text-[rgba(249,94,90,0.57)] leading-[20px]">
            未同步
          </span>
        );
      }
    },
  },
];

export const acquisitionTableColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "通道名称",
    prop: "channel_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "规约类型",
    prop: "protocol_desc",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "通信地址",
    prop: "communication_mode",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
        return  row.comm_name;
    },
  },
  {
    label: "波特率",
    prop: "serial_params.baud_rate",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "数据位",
    prop: "serial_params.data_bit",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "校验位",
    prop: "serial_params.parity_bit",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
      formatter: function (row: any, column: any, cellValue: any) {
        const parity_bit_name_arr = ['奇校验','偶校验','无','标记','空格',]
      if (cellValue || cellValue === 0) {
        return parity_bit_name_arr[cellValue - 1] ;
      } else {
        return "--";
      }
    },
  },
  {
    label: "停止位",
    prop: "serial_params.stop_bit",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export const forwardTableColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "转发通道名称",
    prop: "channel_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
        label: "自定义通道名称",
        prop: "station_channel_name",
        align: "left",
        "show-overflow-tooltip": "true",
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
    label: "规约类型",
    prop: "protocol_desc",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "120px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
//   {
//     label: "通信地址",
//     prop: "communication_mode",
//     align: "left",
//     "show-overflow-tooltip": "true",
//     minWidth: "80px",
//     formatter: function (row: any, column: any, cellValue: any) {
//       if (cellValue === 1) {
//         return "以太网";
//       } else if (cellValue === 2) {
//         return row.serial_params.serial_name ?"串口" +row.serial_params.serial_name:'串口';
//       } else if (cellValue === 3) {
//         return "无线";
//       }
//     },
//   },
  {
    label: "端口号",
    prop: "port",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "存储周期",
    prop: "storage_interval",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        const minu = Math.floor(cellValue / 60);
        return minu * 60 === cellValue? minu + "分钟"  
          :minu? minu + "分钟" + (cellValue - minu * 60) + "秒" : cellValue - minu * 60 + "秒";
      } else {
        return "--";
      }
    },
  },
  {
    label: "关联厂站",
    prop: "station_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export const deviceForwardTableColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "网关设备名称",
    prop: "dev_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "网关设备类型",
    prop: "product_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "通信方式",
    prop: "communication_mode",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "80px",
    formatter: function (row: any, column: any, cellValue: any) {
        if (cellValue === 1) {
          return (
            <span class="round-[3px] box-border inline-block w-[60px] h-[28px] px-[8px] py-[4px] bg-[rgba(0,162,255,0.1)] text-[#00A2FF] leading-[20px]">
              以太网
            </span>
          );
        } else if(cellValue === 2){
          return (
            <span class="round-[3px] box-border inline-block w-[46px] h-[28px] px-[8px] py-[4px] bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[20px]">
              串口
            </span>
          );
        }
      },
  },
  {
    label: "通信地址",
    prop: "comm_addr",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "A网IP",
    prop: "neta_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "B网IP",
    prop: "netb_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "端口号",
    prop: "port",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export const deviceAcquisitionSerialColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "网关设备名称",
    prop: "dev_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "网关设备类型",
    prop: "product_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "通信地址",
    prop: "comm_addr",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export const deviceAcquisitionEthernetColumn = [
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "网关设备名称",
    prop: "dev_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "网关设备类型",
    prop: "product_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },{
    label: "A网IP",
    prop: "neta_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "B网IP",
    prop: "netb_ip",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "端口号",
    prop: "port",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
];

export interface CreateOrEditGatewayRuleFrom {
  gateway_id?: number;
  gateway_name: string;
  gateway_model?: number;
  sync_way?: number;
  primary_ip: string;
  standby_ip: string;
  station_id?: number;
}

export const CreateOrEditGatewayRuleFromRules = reactive<
  FormRules<CreateOrEditGatewayRuleFrom>
>({
  gateway_name: [
    {
      required: true,
      message: "请输入网关名称",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 40,
      message: "长度在 1 到 40 个字符",
      trigger: ["blur", "change"]
    }
  ],
  gateway_model: [
    {
      required: true,
      message: "请选择网关型号",
      trigger: ["blur", "change"],
    },
  ],
  sync_way: [
    {
      required: true,
      message: "请选择同步方式",
      trigger: ["blur", "change"],
    },
  ],
  station_id: [
    {
      required: true,
      message: "请选择厂站",
      trigger: ["blur", "change"],
    },
  ],
  primary_ip: [
    {
      required: true,
      message: "请输入主IP",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
  standby_ip: [
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
});
