import type { FormRules } from "element-plus";

export interface EditConfigurationRuleFrom {
  device_name?: string;
  comm_id?: number;
  port_type?: string;
  addr?: string;
  port?: number;
  portal_mode?: string;
  device_type_name?: string;
  gateway_id?: number;
  gateway_name?: string;
  acquisition_channel_id?: number;
  forward_channel_id?: number;
  forward_channel_name?: string;
  neta_ip?: string;
  netb_ip?: string;
}

export interface EditAdvanceRuleFrom {
  first_byte_wait_time?: number;
  inter_byte_wait_time?: number;
  send_delay?: number;
  recv_delay?: number;
  adjust_time_interval?: number;
}

export const EditConfigurationRuleFromRules = reactive<
  FormRules<EditConfigurationRuleFrom>
>({
  device_name: [
    {
      required: true,
      message: "请输入设备名称",
      trigger: ["blur", "change"],
    },
  ],
  device_type_name: [
    {
      required: true,
      message: "请输入网关设备类型",
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
  portal_mode: [
    {
      required: true,
      message: "请选择通道巡检方式",
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

export const EditAdvanceRuleFromRules = reactive<
  FormRules<EditAdvanceRuleFrom>
>({
  first_byte_wait_time: [
    {
      required: true,
      message: "请输入头字节等待时间",
      trigger: ["blur", "change"],
    },
  ],
  inter_byte_wait_time: [
    {
      required: true,
      message: "请输入接收字节间隔时间",
      trigger: ["blur", "change"],
    },
  ],
  send_delay: [
    {
      required: true,
      message: "请输入发送前延时",
      trigger: ["blur", "change"],
    },
  ],
  recv_delay: [
    {
      required: true,
      message: "请输入接受前延时",
      trigger: ["blur", "change"],
    },
  ],
  adjust_time_interval: [
    {
      required: true,
      message: "请输入对时间隔",
      trigger: ["blur", "change"],
    },
  ],
});
