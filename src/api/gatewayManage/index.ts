import { http } from "@/utils/request";

import type {
  GatewayQuery,
  GatewayMainResponse,
  GatewayAcquisitionResponse,
  GatewayForwardResponse,
  channelDeviceQuery,
  channelDeviceResponse,
  SyncGatewayQuery,
  EnableAcquisitionsOrForwards,
  StorageIntervalResponse,
  ProtocolInfoQuery,
  ProtocolResponse,
  ForwardDetailResponse,
  AcquisitionQuery,
  AcquisitionAdvancedQueryOrResponse,
  ForwardEditQuery,
  StationResponse,
  StationQuery,
  AddGatewayQuery,
    EditGatewayQuery,
    GatewayModelResponse
} from "./types";

/**
 * 获取网关列表
 *
 * @param GatewayQuery
 */
export function getGatewayMainData(pageParams: GatewayQuery) {
  return http.get<UniversalReponse<GatewayMainResponse[]>>(
    "/api/iotnode/v1/gateway",
    { params: pageParams,headers:{ hideNotice: true } }
  );
}

/**
 * 获取采集通道列表
 *
 * @param gateway_id
 */
export function getGatewayAcquisitionData(gateway_id: number) {
  return http.get<UniversalReponse<GatewayAcquisitionResponse[]>>(
      `/api/iotnode/v1/gateway/${gateway_id}/acquisition`,
      {headers:{ hideNotice: true }}
  );
}

/**
 * 获取转发通道列表
 *
 * @param gateway_id
 */
export function getGatewayForwardData(gateway_id: number) {
  return http.get<UniversalReponse<GatewayForwardResponse[]>>(
      `/api/iotnode/v1/gateway/${gateway_id}/forward_list`,
      {headers:{ hideNotice: true }}
  );
}

/**
 * 查询网关设备列表
 *
 * @param gateway_id
 * @param param
 */
export function getGatewayChannelDeviceData(
  gateway_id: number,
  param: { channel_type: number; channel_id: number }
) {
  return http.get<UniversalReponse<channelDeviceResponse[]>>(
    `/api/iotnode/v1/gateway/${gateway_id}/dev_list`,
    { params: param ,headers:{ hideNotice: true }}
  );
}

/**
 * 同步配置
 *
 * @param SyncGatewayQuery
 */
export function syncGateway(param: SyncGatewayQuery) {
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/gateway/${param.gateway_id}/sync_gateway`,
    { is_rebuild: param.is_rebuild },{headers:{hideNotice: true}}
  );
}

/**
 * 批量设置采集通道状态
 *
 * @param EnableAcquisitionsOrForwards
 */
export function enableAcquisitions(
  gateway_id: number,
  param: EnableAcquisitionsOrForwards
) {
  return http.put<UniversalReponse<null>>(
    `/api/iotnode/v1/gateway/${gateway_id}/enable_acquisition`,
    param
  );
}

/**
 * 批量设置转发通道状态
 *
 * @param EnableAcquisitionsOrForwards
 */
export function enableForwards(
  gateway_id: number,
  param: EnableAcquisitionsOrForwards
) {
  return http.put<UniversalReponse<null>>(
    `/api/iotnode/v1/gateway/${gateway_id}/enable_forward`,
    param
  );
}

/**
 * 批量删除网关
 *
 * @param param
 */
export function deleteGateway(id: number[]) {
    return http.delete<UniversalReponse<null>>(
      `/api/iotnode/v1/gateway`,
      {
        data: {gateway_ids:id},
      }
    );
  }

  
// 间隔周期列表
export function getStorageIntervalList(gateway_id:number) {
  return http.get<UniversalReponse<StorageIntervalResponse[]>>(`/api/iotnode/v1/gateway/${gateway_id}/storage_intervals`)
}

// 厂站列表
export function getStationList(params?:StationQuery) {
  return http.get<UniversalReponse<StationResponse[]>>(`/api/pecnode/v1/stationnodes`,{params:params})
}

// 协议列表
export function getProtocolList(id :number, params:ProtocolInfoQuery) {
    return http.get<UniversalReponse<ProtocolResponse[]>>(`/api/iotnode/v1/gateway/${id}/protocol_types`,  { params} )
}

// 查询转发通道详情
export function getForwardDetail(gateway_id:number,channel_id:number) {
  return http.get<UniversalReponse<ForwardDetailResponse>>(`/api/iotnode/v1/gateway/${gateway_id}/forward/${channel_id}`,{ headers: { hideNotice: true } })
}

// 修改转发通道
export function editForwardChannel(params:ForwardEditQuery,gateway_id:number,channel_id:number) {
  return http.put<UniversalReponse<null>>(`/api/iotnode/v1/gateway/${gateway_id}/forward/${channel_id}`, params, { headers: { hideNotice: true } })
}

// 获取采集通道基础配置
export function queryAcquisitionBasic(gateway_id:number,channel_id:number) {
  return http.get<UniversalReponse<AcquisitionAdvancedQueryOrResponse>>(`/api/iotnode/v1/gateway/${gateway_id}/acquisition/${channel_id}`,{ headers: { hideNotice: true } })
}

// 修改采集通道基础配置
export function editAcquisitionBasic(params:AcquisitionQuery) {
  return http.put<UniversalReponse<null>>(`/api/iotnode/v1/gateway/${params.gateway_id}/acquisition/${params.channel_id}`,  params, { headers: { hideNotice: true } })
}

// 修改采集通道高级参数
export function editAcquisitionAdvanced(params: AcquisitionAdvancedQueryOrResponse,gateway_id:number,channel_id:number) {
  return http.put<UniversalReponse<null>>(`/api/iotnode/v1/gateway/${gateway_id}/acquisition/${channel_id}/advance_params`,  params,{ headers: { hideNotice: true } } )
}

// 获取采集通道高级参数
export function queryAcquisitionAdvanced(gateway_id:number,channel_id:number) {
  return http.get<UniversalReponse<AcquisitionAdvancedQueryOrResponse>>(`/api/iotnode/v1/gateway/${gateway_id}/acquisition/${channel_id}/advance_params`,{ headers: { hideNotice: true } })
}

// 新增网关
export function addGateway(params:AddGatewayQuery) {
  return http.post<UniversalReponse<null>>("/api/iotnode/v1/gateway", params, { headers: { hideNotice: true } })
}

// 编辑网关
export function editGateway(params:EditGatewayQuery,gateway_id:number) {
  return http.put<UniversalReponse<null>>(`/api/iotnode/v1/gateway/${gateway_id}`, params, { headers: { hideNotice: true } })
}

//获取网关类型列表
export function getGatewayModelList() {
  return http.get<UniversalReponse<GatewayModelResponse[]>>("/api/iotnode/v1/gateway_model")
}

//获取单个网关
export function getSingleGateway(gateway_id:number) {
  return http.get<UniversalReponse<GatewayMainResponse>>(`/api/iotnode/v1/gateway/${gateway_id}`,{ headers: { hideNotice: true } })
}