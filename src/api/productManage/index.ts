import { http } from "@/utils/request";
import type {
  PageMainQuery,
  MainProductData,
  ProductDataInfo,
  ProductPropertyQuery,
  ProductPropertyResponse,
  CreateOrEditProduct,
  CreateOrEditProductPropertyQuery,
  ParameterProductRes,
  ProductRemoteQuery,
  ProductRemoteResponse,
  CreateOrEditProductRemoteQuery,
  ProductUniversalQuery,
  ProductRecordResponse,
  ProductAlarmTemplateResponse,
  CreateOrEditProductAlarmTemplateQuery,
  ProductAlarmQuery,
  ProductAlarmResponse,
  CreateOrEditProductAlarmQuery,
  ProductSnapshotStrategyResponse,
  ProductSnapshotTableResponse,
  ProductVersionResponse,
  ProductConfigurationResponse,
  DataMenuResponse,
  DataIdResponse,
  ImportDriQuery,
  ImportDriverQuery,
  DataLogSolutionMapResponse,
  EventModelStationsQuery,
  EventModelStationsResponse,
  EventModelChannelsQuery,
  EventModelChannelsResponse,
  EventModelDevicesQuery,
  EventModelDevicesResponse,
  EventModelDevicesCreateOrDeleteQuery,
  EventModelDevicesTreeResponse,
} from "./types";

/**
 * 获取产品库
 *
 * @param PageMainQuery
 */
export function getMainProductDatas(pageParams?: PageMainQuery) {
  return http.get<UniversalReponse<MainProductData[]>>(
    "/api/iotnode/v1/products",
    { params: pageParams,headers:{hideNotice: true} }
  );
}

/**
 * 获取产品基本信息
 *
 * @param id
 */
export function getProductDataInfo(id: number) {
  return http.get<UniversalReponse<ProductDataInfo>>(
    `/api/iotnode/v1/products/${id}/info`,
    { headers: { hideNotice: true } }
  );
}

/**
 * 创建产品
 *
 * @param CreateOrEditProduct
 */
export function createProduct(params: CreateOrEditProduct) {
  return http.post<UniversalReponse<null>>(`/api/iotnode/v1/products`, [
    params,
  ]);
}

/**
 * 变更产品基本信息
 * @param id
 * @param CreateOrEditProduct
 */
export function editProduct(id: number, params: CreateOrEditProduct) {
  return http.patch<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${id}/info`,
    params
  );
}

/**
 * 获取产品属性
 *
 * @param id
 * @param ProductPropertyQuery
 */
export function getProductProperty(id: number, params: ProductPropertyQuery) {
  return http.get<UniversalReponse<ProductPropertyResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/property`,
    { params }
  );
}

/**
 * 新增产品属性
 *
 * @param id
 * @param CreateOrEditProductPropertyQuery
 */
export function createProductProperty(
  id: number,
  params: CreateOrEditProductPropertyQuery[]
) {
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${id}/model/property`,
    params
  );
}

/**
 * 更新产品属性
 *
 * @param id
 * @param CreateOrEditProductPropertyQuery
 */
export function uptoDateProductProperty(
  id: number,
  params: CreateOrEditProductPropertyQuery
) {
  return http.put<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${id}/model/property/${params.property_id}`,
    params
  );
}

/**
 * 删除产品属性
 *
 * @param id
 */
export function deleteProductProperty(id: number, property_ids: number[]) {
  return http.delete<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${id}/model/property`,
    { data: { property_ids } }
  );
}

/**
 * 获取参数名称
 *
 * @param name
 */
export function getParamster(name: string) {
  return http.get<UniversalReponse<ParameterProductRes[]>>(
    `api/iotnode/v1/identification/data_name`,
    { params: { name } }
  );
}

/**
 * 获取产品属性
 *
 * @param id
 * @param ProductRemoteQuery
 */
export function getProductRemoteService(
  id: number,
  params: ProductRemoteQuery
) {
  return http.get<UniversalReponse<ProductRemoteResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/service`,
    { params }
  );
}

/**
 * 新增遥控
 *
 * @param id
 * @param CreateOrEditProductRemoteQuery
 */
export function createProductRemoteService(
  id: number,
  params: CreateOrEditProductRemoteQuery[]
) {
  return http.post<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${id}/model/service`,
    params
  );
}

/**
 * 更新遥控
 *
 * @param id
 * @param CreateOrEditProductRemoteQuery
 */
export function uptoDateProductRemoteService(
  id: number,
  params: CreateOrEditProductRemoteQuery
) {
  return http.put<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${id}/model/service/${params.service_id}`,
    params
  );
}

/**
 * 删除遥控
 *
 * @param id
 */
export function deleteProductRemoteService(id: number, service_ids: number[]) {
  return http.delete<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${id}/model/service`,
    { data: service_ids }
  );
}

/**
 * 获取定时记录映射方案
 *
 * @param id
 * @param ProductUniversalQuery
 */
export function getProductRecord(id: number, params: ProductUniversalQuery) {
  return http.get<UniversalReponse<ProductRecordResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/solution_map/datalog_map`,
    { params }
  );
}

/**
 * 获取事件模板
 *
 * @param id
 * @param ProductUniversalQuery
 */
export function getProductAlarmTemplate(
  id: number,
  params: ProductUniversalQuery = { page: 1, page_size: 10000 }
) {
  return http.get<UniversalReponse<ProductAlarmTemplateResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/event`,
    { params }
  );
}

/**
 * 新增事件模板
 *
 * @param id
 */
export function createProductAlarmTemplate(
  id: number,
  params: { strategy_name: string }
) {
  return http.post<UniversalReponse<ProductAlarmTemplateResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/event`,
    params
  );
}

/**
 * 更新事件模板
 *
 * @param id
 * @param CreateOrEditProductAlarmTemplateQuery
 */
export function uptoDateProductAlarmTemplate(
  id: number,
  params: CreateOrEditProductAlarmTemplateQuery
) {
  return http.put<UniversalReponse<ProductAlarmTemplateResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/event/${params.strategy_id}`,
    params
  );
}

/**
 * 删除事件模板
 *
 * @param id
 * @param strategy_ids
 */
export function deleteProductAlarmTemplate(id: number, strategy_ids: number[]) {
  return http.delete<UniversalReponse<ProductAlarmTemplateResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/event`,
    { data: { strategy_ids } }
  );
}

/**
 * 获取产品事件
 *
 * @param id
 * @param event_model_id
 * @param ProductAlarmQuery
 */
export function getProductAlarm(
  id: number,
  event_model_id: number,
  params: ProductAlarmQuery
) {
  return http.get<UniversalReponse<ProductAlarmResponse[]>>(
    `/api/iotnode/v1/products/${id}/model/event/${event_model_id}`,
    { params }
  );
}

/**
 * 新增产品事件
 *
 * @param id
 * @param event_model_id
 * @param CreateOrEditProductAlarmQuery
 */
export function createProductAlarm(
  id: number,
  event_model_id: number,
  params: CreateOrEditProductAlarmQuery[]
) {
  return http.post<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${id}/model/event/${event_model_id}`,
    params
  );
}

/**
 * 更新产品事件
 *
 * @param id
 * @param event_model_id
 * @param CreateOrEditProductAlarmQuery
 */
export function uptoDateProductAlarm(
  id: number,
  event_model_id: number,
  params: CreateOrEditProductAlarmQuery
) {
  return http.put<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${id}/model/event/${event_model_id}/${params.event_id}`,
    params
  );
}

/**
 * 删除产品事件
 *
 * @param id
 * @param event_model_id
 * @param event_ids
 */
export function deleteProductAlarm(
  id: number,
  event_model_id: number,
  event_ids: number[]
) {
  return http.delete<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${id}/model/event/${event_model_id}`,
    { data: { event_ids } }
  );
}

/**
 * 删除产品
 *
 * @param product_ids
 */
export function deleteProducts(product_ids: number[]) {
  return http.delete<UniversalReponse<object>>(`/api/iotnode/v1/products`, {
    data: { product_ids },
  });
}

/**
 * 获取产品属性快照策略
 *
 * @param iproduct_id
 * @param para_type
 */
export function getProductSnapshotStrategy(
  product_id: number,
  para_type: number
) {
  return http.get<UniversalReponse<ProductSnapshotStrategyResponse>>(
    `/api/iotnode/v1/products/${product_id}/model/snapshot_strategy/${para_type}`
  );
}

/**
 * 更改产品属性快照策略
 *
 * @param iproduct_id
 * @param para_type
 */
export function updateProductSnapshotStrategy(
  product_id: number,
  para_type: number,
  params: ProductSnapshotStrategyResponse
) {
  return http.put<UniversalReponse<ProductSnapshotStrategyResponse>>(
    `/api/iotnode/v1/products/${product_id}/model/snapshot_strategy/${para_type}`,
    params
  );
}

/**
 * 获取产品选择测点
 *
 * @param iproduct_id
 * @param para_type
 * @param ProductUniversalQuery
 */
export function getProductMeasureSnapshotTable(
  product_id: number,
  para_type: number,
  params: { page_size: number; page: number; solution: string }
) {
  return http.get<UniversalReponse<ProductSnapshotTableResponse[]>>(
    `/api/iotnode/v1/products/${product_id}/model/property_snapshot/${para_type}`,
    { params }
  );
}

/**
 * 获取产品属性快照
 *
 * @param product_id
 * @param para_type
 * @param ProductUniversalQuery
 */
export function getProductSnapshotTable(
  product_id: number,
  para_type: number,
  params: ProductUniversalQuery
) {
  return http.get<UniversalReponse<ProductSnapshotTableResponse[]>>(
    `/api/iotnode/v1/products/${product_id}/model/snapshot/${para_type}`,
    { params }
  );
}

/**
 * 新增产品属性快照
 *
 * @param product_id
 * @param para_type
 * @param para_handles
 */
export function newProductSnapshotTable(
  product_id: number,
  para_type: number,
  para_handles: { para_handle: number; property_type: number }[]
) {
  return http.post<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${product_id}/model/snapshot/${para_type}`,
    { snapshots: para_handles }
  );
}

/**
 * 删除产品属性快照
 *
 * @param product_id
 * @param para_type
 * @param para_handles
 */
export function deleteProductSnapshotTable(
  product_id: number,
  para_type: number,
  para_handles: { para_handle: number; property_type: number }[]
) {
  return http.delete<UniversalReponse<object>>(
    `/api/iotnode/v1/products/${product_id}/model/snapshot/${para_type}`,
    { data: { snapshots: para_handles } }
  );
}

/**
 * 产品上线
 *
 * @param id
 */
export function getProductRelease(id: number) {
  return http.post<UniversalReponse<[]>>(
    `/api/iotnode/v1/products/${id}/release`
  );
}

/**
 * 查询产品版本
 * @param id
 *
 */
export function productVersion(id: number) {
  return http.get<UniversalReponse<ProductVersionResponse>>(
    `/api/iotnode/v1/products/${id}/release/product_version`
  );
}

/**
 * 查询通讯配置相关
 * @param id
 *
 */
export function getCommConfig(id: number) {
  return http.get<UniversalReponse<ProductConfigurationResponse>>(
    `/api/iotnode/v1/products/${id}/access_config/comm_config`
  );
}

/**
 * 变更通讯配置相关
 * @param id
 * @param param
 */
export function putCommConfig(id: number, param: ProductConfigurationResponse) {
  return http.put<UniversalReponse<Object>>(
    `/api/iotnode/v1/products/${id}/access_config/comm_config`,
    param
  );
}

/**
 * 查询下一级DataID索引目录
 * @param id
 *
 */
export function getDataMenu(id: number, param: number) {
  return http.get<UniversalReponse<DataMenuResponse[]>>(
    `/api/iotnode/v1/identification/data_menu/${id}`,
    {
      params: { property_type: param },
    }
  );
}

/**
 * 查询DataID
 *
 */
export function getDataID(param: {
  id: number;
  page_size: number;
  page: number;
  key_word: string;
  property_type?: number;
}) {
  return http.get<UniversalReponse<DataIdResponse[]>>(
    `/api/iotnode/v1/identification/data_id/${param.id}`,
    {
      params: {
        page_size: param.page_size,
        page: param.page,
        key_word: param.key_word,
        property_type: param.property_type,
      },
      headers: { hideNotice: true },
    }
  );
}

/**
 * 导入Dri(网关驱动文件)
 * @param data
 */
export function importDri(data: ImportDriQuery) {
  const formData = new FormData();
  for (let key in data) {
    data[key] ? formData.append(key, data[key]) : null;
  }
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/products/import/dri`,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
}

/**
 * 导入Dri(网关驱动文件)
 * @param data
 */
export function importDriver(data: ImportDriverQuery) {
  const formData = new FormData();
  for (let key in data) {
    data[key] ? formData.append(key, data[key]) : null;
  }
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/products/import/driver`,
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
}

/**
 * 查询映射方案信息
 * @param id 设备类型
 */
export function getDataLogSolutionMap(id: number) {
  return http.get<UniversalReponse<DataLogSolutionMapResponse[]>>(
    `/api/iotnode/v1/identification/data_log_solution_map/${id}`
  );
}

/**
 * 获取厂站列表，附带告警策略关联信息
 * @param param
 */
export function getEventModelStations(param: EventModelStationsQuery) {
  return http.get<UniversalReponse<EventModelStationsResponse[]>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/stations`
  );
}

/**
 * 获取通道列表，附带告警策略关联信息
 * @param param
 */
export function getEventModelChannels(param: EventModelChannelsQuery) {
  return http.get<UniversalReponse<EventModelChannelsResponse[]>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/channels`,
    { params: { station_id: param.station_id } }
  );
}

/**
 * 获取设备列表，附带告警策略关联信息
 * @param param
 */
export function getEventModelDevices(param: EventModelDevicesQuery) {
  return http.get<UniversalReponse<EventModelDevicesResponse[]>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/devices`,
    { params: { channel_id: param.channel_id } }
  );
}

/**
 * 告警上线
 *
 * @param param
 */
export function eventModelRelease(param: EventModelStationsQuery) {
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/release`
  );
}

/**
 * 获取设备节点树，附带告警策略关联信息
 * @param param
 */
export function getEventModelDevicesTree(param: EventModelStationsQuery) {
  return http.get<UniversalReponse<EventModelDevicesTreeResponse>>(
      `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/node_tree`, {
        headers: { hideNotice: true }
    }
  );
}

/**
 * 新增告警策略设备关联关系
 *
 * @param param
 */
export function createEventModelDevices(
  param: EventModelDevicesCreateOrDeleteQuery
) {
  return http.post<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/devices`,
    { device_ids: param.device_ids }
  );
}

/**
 * 删除告警策略设备关联关系
 *
 * @param param
 */
export function deleteEventModelDevices(
  param: EventModelDevicesCreateOrDeleteQuery
) {
  return http.delete<UniversalReponse<null>>(
    `/api/iotnode/v1/products/${param.product_id}/model/event/${param.event_model_id}/devices`,
    { data: { device_ids: param.device_ids } }
  );
}
