

export interface StorageIntervalResponse{
    interval: number;
    text: string;
}
export interface ProtocolResponse{
    protocol_id: number;
    protocol_name: string;
    protocol_desc: string;
    communication_mode: number;
}

export interface ProtocolInfoQuery {
    channel_type: number;
    communication_mode: number;
}

interface BasicPara{
    peer_ip_1?: string;
    peer_ip_2?: string;
    peer_ip_3?: string;
    peer_ip_4?: string;
    peer_ip_5?: string;
    server?: string;
    port?: number;
    serverBK?: string;
    portBK?: number;
    Token?: string;
}

interface AdvancedPara{
    is_data_keep?: boolean;
    is_tls?: boolean;
    tls_file?: string;
    idle_time?: number;
    delay_time?: number;
    res?: string;
    commu_id?: number;
    is_double_alive?: boolean;
    eth_list?: string;
}
export interface ForwardDetailResponse{
    channel_id: number;
    channel_name: string;
    protocol_id: number;
    protocol_desc: string;
    port: number;
    storage_interval: number;
    storage_interval_name: string;
    station_id: number;
    station_name: string;
    tation_channel_id: number;
    station_channel_name: string;
    basic_para_list: BasicPara;
    advance_para_list: AdvancedPara;
}

interface SerialPara{
    baud_rate?: number;
    data_bit?: number;
    parity_bit?: number;
    stop_bit?: number;
}
    
export interface AcquisitionQuery{
    gateway_id: number;
    channel_id: number;
    channel_name:string
   	protocol_id: number;
    communication_mode: number;
    serial_params?: SerialPara; 
}

export interface AcquisitionAdvancedQueryOrResponse{
   
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

interface CetCloudAdvance{
    is_data_keep: boolean;
    is_tls: boolean;
    tls_file?: string;
    idle_time: number;
    delay_time: number;
    res: string;
}

interface ModbusAdvance{
    is_data_keep: boolean;
    idle_time: number;
    commu_id: number;
    is_double_alive: boolean;
    eth_list:string
    delay_time: number;
    res: string;
}

interface ModbusBasic{
    peer_ip_1: string;
    peer_ip_2: string;
    peer_ip_3: string;
    peer_ip_4: string;
    peer_ip_5: string;
}
interface CetCloudBasic{
    server: string;
    port: number;
    server_bk: string;
    port_bk: number;
    token: string;
}
export interface ForwardEditQuery{
    channel_name: string;
    protocol_id: number;
    port: number;
  	storage_interval: number;
    station_id: number;
    station_channel_id: number;
    basic_para_list:ModbusBasic | CetCloudBasic;
    advance_para_list:	ModbusAdvance | CetCloudAdvance
}

export interface StationQuery{
    page_size: number;
	page: number;
    node_name: string;
}
export interface StationResponse{
    nodeId: number;
    nodeName: string;
    nodeType: number;
    parentNodeId: number;
    parentNodeType: number;
    updateTime: number;
}

export interface AddGatewayQuery{
    gateway_name: string;
    gateway_model: number;
    sync_way: number;
    primary_ip: string;
    standby_ip: string;
    station_id: number;	
}

export interface EditGatewayQuery{
    gateway_name: string;
    primary_ip: string;
	standby_ip:string;
}