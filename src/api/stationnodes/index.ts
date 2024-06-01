import {http} from "@/utils/request";
import type {PageQuery,NodeStation} from "./types"

/**
 * 获取厂站
 *
 * @param pageParams
 */
export function getNetworkNodes(pageParams?:PageQuery
  ) {
    return http.get<UniversalReponse<NodeStation[]>> ( "/api/pecnode/v1/stationnodes",
        {params: pageParams}
    );
}

/**
 * 获取厂站详情
 *
 * @param id
 */
export function getNetworkNode(id:number
    ) {
      return http.get<UniversalReponse<NodeStation[]>> ( `/api/pecnode/v1/stations/${id}`
      );
  }

/**
 * 新建厂站
 *
 * @param name
 */
export function createStation(name:string
) {
    return http.post<UniversalReponse<number | boolean>>(`/api/pecnode/v1/station?name=${name}`)
}

/**
 * 更新厂站
 *
 * @param param
 */
export function editStation(param:{nodeId:number,nodeName:string}
) {
    return http.put<UniversalReponse<number | boolean>>(`/api/pecnode/v1/station/${param.nodeId}?name=${param.nodeName}`)
}

/**
 * 删除厂站
 *
 * @param nodeId
 */
export function deleteStation(nodeId:number
) {
    return http.delete<UniversalReponse<number | boolean>>(`/api/pecnode/v1/station/${nodeId}`)
}