import request,{http} from "@/utils/request";
import type {QueryAllStationsParam,QueryStationsParam,ChannelsResponse,Drvtypes,ChannelParams,ChannelData} from "./type"

/**
 * 获取所有厂站下的通道
 *
 * @param queryParams
 */
export function getAllChannelNodes(queryParams:QueryAllStationsParam
) {
    return http.get<UniversalReponse<ChannelsResponse[]>> ( "/api/pecnode/v1/stations",
    {params: queryParams,headers:{hideNotice: true}}
);
}

/**
 * 获取指定厂站下的通道节点
 *
 * @param queryParams
 */
export function getChannelNodes(queryParams:QueryStationsParam
    ): any {
      return request({
        url: `/api/pecnode/v1/station/${queryParams.id}/channels`,
          method: "get",
          params: {page_size:queryParams.page_size,page:queryParams.page,node_name:queryParams.node_name,includeInf:queryParams.includeInf,maxDeviceCount:queryParams.maxDeviceCount},
          headers:{hideNotice: true}
      });
  }

  /**
 * 删除通道
 *
 * @param data
 */
export function delChannels(data:number[]):any {
    return request({
        url: '/api/pecnode/v1/channels',
        method: "delete",
        data: data,
      });
}


/**
 * 获取所有的驱动类型
 */
export function getAllDrvtypes(
    ) {
        return http.get<UniversalReponse<Drvtypes[]>> ( "/api/pecnode/v1/drvtypes",
    );
}

/**
 * 获取所有的设备类型
 */
export function getAllDevicetypes(
    ) {
        return http.get<UniversalReponse<Drvtypes[]>> ( "/api/pecnode/v1/devicetypes",
    );
}
    
/**
 * 获取指定id列表的通道节点
 *  @param params
 *  @param data
 */
export function getChannelNodesById(params:{isCustomInf:boolean,includeInf:boolean},data:number[]
    ) {
        return http.post<UniversalReponse<ChannelData[]>> ( "/api//pecnode/v1/channel/nodes",data,{params:{includeInf:params.includeInf},headers:{isCustomInf:params.isCustomInf}}
    );
}

 /**
 * 新建通道
 *
 * @param param
 * @param data
 */
 export function addChannels(param:ChannelParams,data:ChannelData[]
    ) {
     return http.post<UniversalReponse<Drvtypes[]>>(`/api/pecnode/v1/station/${param.id}/channels`,data, {headers:{isCustomInf:param.isCustomInf}}
    );
}

/**
 * 新建通道
 *
 * @param param
 * @param data
 */
export function editeChannels(param:ChannelParams,data:ChannelData[]
    ) {
     return http.put<UniversalReponse<Drvtypes[]>>(`/api/pecnode/v1/channels`,data, {headers:{isCustomInf:param.isCustomInf}}
    );
}