import type { FormRules } from "element-plus";
import moment from "moment";

export const mainTableColumn = ref([
  {
    label: "设备ID",
    prop: "device_id",
    width: "100px",
    align: "left",
  },
  {
    label: "设备名称",
    prop: "device_name",
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
  {
    label: "产品名称",
    prop: "product_name",
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
  {
    label: "产品类型",
    prop: "product_type",
    align: "left",
    width: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return (
          <span class="round-[3px] box-border inline-block w-[46px] h-[28px] px-[8px] py-[4px] bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[20px]">
            直采
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] box-border inline-block w-[86px] h-[28px] px-[8px] py-[4px] bg-[#E4F1FF] text-[#00A2FF] leading-[20px]">
            网关子设备
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "关联通道",
    prop: "channel_name",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "通信地址",
    prop: "comm_addr",
    align: "left",
    "show-overflow-tooltip": "true",
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
    label: "通信ID",
    prop: "comm_id",
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
]);

export interface CreateOrEditDeviceRuleFrom {
  device_name?: string;
  product_id?: number;
  product_name?: string;
  product_type?: number;
  channel_id?: number;
  gateway_id?: number;
  acquisition_channel_id?: number;
  gatewayDeviceType?: number;
  associated_gateway?: number;
  acquisition_channel?: number;
  forward_channel_id?: number;
  portal_mode?: string;
  comm_id?: number;
  port_type?: string;
  port?: number;
  addr?: string;
  neta_ip?: string;
  netb_ip?: string;
}

export const CreateOrEditDeviceRuleFromRules = reactive<
  FormRules<CreateOrEditDeviceRuleFrom>
>({
  device_name: [
    {
      required: true,
      message: "请输入设备名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 40,
      message: "长度在 1 到 40 个字符",
      trigger: ["blur", "change"],
    },
  ],
  product_id: [
    {
      required: true,
      message: "请选择产品名称",
      trigger: ["blur", "change"],
    },
  ],
  product_type: [
    {
      required: true,
      message: "请选择产品类型",
      trigger: ["blur", "change"],
    },
  ],
  channel_id: [
    {
      required: true,
      message: "请选择关联通道",
      trigger: ["blur", "change"],
    },
  ],
  gatewayDeviceType: [
    {
      required: true,
      message: "请选择网关设备类型",
      trigger: ["blur", "change"],
    },
  ],
  gateway_id: [
    {
      required: true,
      message: "请选择关联网关",
      trigger: ["blur", "change"],
    },
  ],
  acquisition_channel_id: [
    {
      required: true,
      message: "请选择采集通道",
      trigger: ["blur", "change"],
    },
  ],
  forward_channel_id: [
    {
      required: true,
      message: "请选择转发通道",
      trigger: ["blur", "change"],
    },
  ],
  port_type: [
    {
      required: true,
      message: "请选择通信方式",
      trigger: ["blur", "change"],
    },
  ],
  comm_id: [
    {
      required: true,
      message: "请输入通信ID",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
      message: "请输入1-65535内整数",
      trigger: ["blur", "change"],
    },
  ],
  addr: [
    {
      required: true,
      message: "请输入主IP",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, // 请输入域名
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
  neta_ip: [
    {
      required: true,
      message: "请输入A网IP",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, // 请输入域名
      message: "请输入正确的ip地址",
      trigger: ["blur", "change"],
    },
  ],
  netb_ip: {
    pattern:
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, // 请输入域名
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
  },
  port: [
    {
      required: true,
      message: "请输入端口号",
      trigger: ["blur", "change"],
    },
    {
      pattern:
        /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
      message: "请输入1-65535内整数",
      trigger: ["blur", "change"],
    },
  ],
});
