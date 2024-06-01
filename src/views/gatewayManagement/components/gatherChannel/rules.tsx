import type { FormRules } from "element-plus";
import moment from "moment";


export interface EditChannelRuleFrom {
  channel_name: string;
  protocol_id: number;
  communication_mode: string;
  serial_name: number;
  baud_rate: number;
  data_bit: number;
  parity_bit: number;
  stop_bit: number;
}

export const EditChannelRuleFromRules = reactive<
  FormRules<EditChannelRuleFrom>
>({
  channel_name: [
    {
      required: true,
      message: "请输入采集通道名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 31,
      message: "长度在 1 到 31 个字符",
      trigger: ["blur", "change"]
    }
  ],
  protocol_id: [
    {
      required: true,
      message: "请选择规约类型",
      trigger: ["blur", "change"],
    }
  ],
  communication_mode: [
    {
      required: true,
      message: "请选择通信方式",
      trigger: ["blur", "change"],
    }
  ]
});

export interface AdvancedParam {
  device_switch_time: number;
  first_byte_wait_time: number;
  byte_interval: number;
  send_wait_time: number;
  sys_time_cycle: number;
  sample_cycle: number;
  wait_reconnect_time: number;
  err_count: number;
  advanced_remark: string;
}

export const EditAdvancedParamRuleFromRules = reactive<FormRules<AdvancedParam>>({
  device_switch_time:[{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  first_byte_wait_time: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  byte_interval:[{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  send_wait_time: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  sys_time_cycle: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  sample_cycle: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  wait_reconnect_time: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }],
  err_count: [{
    required: true,
    message: "请输入",
    trigger:["blur","change"]
  }]
})