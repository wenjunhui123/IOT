export interface DevicesUniversalQuery {
  page_size: number;
  page: number;
  device_name?: string;
  chn_id?: number;
  sta_id?: number;
}

export interface MainDeviceData {
  device_id: number;
  device_name: string;
  product_id: number;
  product_name: string;
  product_type: number;
  channel_id: number;
  channel_name: string;
  portal_mode: string;
  port_type: string;
  driver_name: string;
  comm_addr: string;
  comm_id: number;
  station_id: number;
  station_name: string;
}

export interface DeviceDataInfoQuery {
  device_id: number;
}

export interface GatewayConfig {
  comm_id?: number;

  neta_ip?: string;
  netb_ip?: string;
  port?: number;
}

export interface CommConfig {
  comm_id?: number;

  port?: number;
  baud_rate?: number;
  byte_size?: number;
  stop_bits?: number;
  parity?: string;

  addr?: string;

  acquisition_channel_id?: number;
  forward_channel_id?: number;
  gateway_id?: number;
  gateway_name?: string;
  gateway_config?: GatewayConfig;

  adv_param?: AdvancedParam;
}

export interface AdvancedParam {
  first_byte_wait_time: number;
  inter_byte_wait_time: number;
  send_delay: number;
  recv_delay: number;
  adjust_time_interval: number;
  read_eve_record: number | boolean;
  read_data_record: number | boolean;
  read_wav_record: number | boolean;
  setp_meas_name: number | boolean;
  write_console_info: number | boolean;
  write_debug_info: number | boolean;
}

export interface DeviceDataInfoResponse {
  device_id?: number;
  device_name: string;
  product_id: number;
  product_name: string;
  product_type: number;
  device_type_name?: string;
  channel_id: number;
  channel_name: string;
  portal_mode: string;
  port_type: string;
  comm_config?: CommConfig;
  adv_param?: AdvancedParam;
  custom_inf: string;
}

export interface CreateDeviceDataQuerty {
  device_name: string;
  product_id?: number;
  product_type?: number;
  channel_id?: number;
  portal_mode?: string;
  port_type?: string;
  comm_config?: CommConfig;
}

export interface EditDeviceDataQuerty {
  device_id?: number;
  device_name: string;
  port_type?: string;
  adv_param?: AdvancedParam;
  comm_config: CommConfig;
  custom_inf: string;
}

export interface ChannelTypeResponse {
    channel_type: number;
    channel_name: string;
    type_param: {
        portal_mode?: string;
        gateway_id?: number;
        gateway_name?: string;
        forward_channel_id?: number;
        forward_channel_name?:string
    }
}