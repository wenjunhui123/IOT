import { http } from "@/utils/request";
import type {
  DevicesUniversalQuery,
  MainDeviceData,
  DeviceDataInfoQuery,
  DeviceDataInfoResponse,
  CreateDeviceDataQuerty,
  EditDeviceDataQuerty,
  ChannelTypeResponse,
} from "./types";

/**
 * 获取设备列表
 *
 * @param DevicesUniversalQuery
 */
export function getMainDeviceData(pageParams?: DevicesUniversalQuery) {
  return http.get<UniversalReponse<MainDeviceData[]>>(
    "/api/iotnode/v1/devices",
    {
      params: pageParams,
      headers: { includeNoProduct: true, hideNotice: true },
    }
  );
}

/**
 * 获取设备基本信息
 *
 * @param DeviceDataInfoQuery
 */
export function getProductDataInfo(param: DeviceDataInfoQuery) {
  return http.get<UniversalReponse<DeviceDataInfoResponse>>(
    `/api/iotnode/v1/devices/${param.device_id}`,
    { headers: { includeNoProduct: true, hideNotice: true } }
  );
}

/**
 * 创建设备
 *
 * @param CreateDeviceDataQuerty
 */
export function createDevices(params: CreateDeviceDataQuerty) {
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/devices`,
    [params],
    { headers: { hideNotice: true } }
  );
}

/**
 * 更新设备
 *
 * @param EditDeviceDataQuerty
 */
export function editDevices(params: EditDeviceDataQuerty) {
    const device_id = params.device_id;
    delete params.device_id
  return http.put<UniversalReponse<null>>(
    `/api/iotnode/v1/devices/${device_id}`,
    params,
    { headers: { hideNotice: true ,includeNoProduct:true} }
  );
}

/**
 * 删除设备
 *
 * @param id
 */
export function deleteDevices(id: number[]) {
  return http.delete<UniversalReponse<null>>(`/api/iotnode/v1/devices`, {
    data: id,
    headers: { hideNotice: true },
  });
}

/**
 * 获取指定ID的通道信息
 *
 * @param channel_id
 */
export function getChannelIdType(channel_id: number) {
  return http.get<UniversalReponse<ChannelTypeResponse>>(
    `/api/iotnode/v1/channel_type/${channel_id}`
  );
}
