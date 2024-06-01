import type { FormRules } from "element-plus";

interface EditRules {
    channel_name: string;
    protocol_id: number;
    communication_mode: string;
    port: number;
    storage_interval: number;
    station_id: number;
    station_channel_id: number;
    peer_ip_1: string;
    peer_ip_2?: string;
    peer_ip_3?: string;
    peer_ip_4?: string;
    peer_ip_5?: string;
    server_bk?: string;
    is_data_keep: boolean;
    idle_time: number;
    commu_id: number;
    is_double_alive: boolean;
    eth_list: string;
    delay_time: number;
    res: string;
    server: string,
    serverBK: string,
    port_server?: number;
    port_bk?: number;
    portBK: number,
    token?: string,
    Token: string,
    is_tls: false,
}

export const EditFormwardChannelFormRules = reactive<FormRules<EditRules>>({
    channel_name: [
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
        {
          min: 1,
          max: 10,
          message: "长度在 1 到 10 个字符",
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
      }
    ],
    storage_interval: [
        {
          required: true,
          message: "请输入存储周期",
          trigger: ["blur", "change"],
        }
    ],
    station_id: [
        {
          required: true,
          message: "请选择关联厂站",
          trigger: ["blur", "change"],
        }
  ],
  peer_ip_1: [
    {
      pattern:
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      // /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
    }
  ],
  peer_ip_2: [
    {
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
    }
  ],
  peer_ip_3: [
    {
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
    }
  ],
  peer_ip_4:[{
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
  }],
  peer_ip_5:[{
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: "请输入正确的ip地址",
    trigger: ["blur", "change"],
  }],
  server:[{
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/,
    message: "请输入正确的ip地址或域名",
    trigger: ["blur", "change"],
  }],
  server_bk:[{
    pattern:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/,
    message: "请输入正确的ip地址或域名",
    trigger: ["blur", "change"],
  }],
  token: [
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
      min: 0,
      max: 21,
      message: "长度在 0 到 21 个字符",
      trigger: ["blur", "change"]
  }],
  res: [
    {
      min: 0,
      max: 21,
      message: "长度在 0 到 21 个字符",
      trigger: ["blur", "change"]
    }
  ],
  eth_list: [
    {
      min: 0,
      max: 21,
      message: "长度在 0 到 21 个字符",
      trigger: ["blur", "change"]
    }
  ],
  port_server: [
    {
      pattern:
        /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
      message: "请输入1-65535内整数",
      trigger: ["blur", "change"],
    }
  ],
  port_bk: [
    {
    pattern:
      /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/,
    message: "请输入1-65535内整数",
    trigger: ["blur", "change"],
    }
  ]
})

export interface BasicConfigModel{
    channel_name: string;
    protocol_id: number;
    protocol_desc:  string;
    communication_mode: string;
    storage_interval: number;
    station_id: number;
    station_channel_name: string;
    channel_id: number;
    peer_ip_1: string;
    peer_ip_2: string;
    peer_ip_3: string;
    peer_ip_4: string;
    peer_ip_5: string;
    is_data_keep: boolean;
    idle_time: number;
    commu_id: number;
    is_double_alive: boolean;
    eth_list: string;
    delay_time: number;
    res: string;
    server:  string;
    server_bk: string;
    port:number;
    port_server: number;
    port_bk:number;
    token: string;
    is_tls: boolean;
}