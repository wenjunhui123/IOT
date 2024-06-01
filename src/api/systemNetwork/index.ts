import request,{http} from "@/utils/request";
import { type AxiosPromise } from "axios";
import type { nodeQuery, NodeExponse, NodeOneExponse } from "./types";
import type { NetworkParams} from "@/views/systemNetworkNodeManagement/components/rules";

/**
 * 获取网络节点列表
 *
 * @param queryParams
 */
export function getNetworkNodes(
  queryParams: nodeQuery
)  {
    return http.get<NodeExponse> ( "/api/pecnode/v1/netWork/nodes",
        {params: queryParams}
    );
}

/**
 * 获取指定ID的网络节点信息
 *
 * @param id
 */
export function getIdNetworkNode(id: number) {
    return http.get<NodeOneExponse> (`/api/pecnode/v1/netWork/${id}/node`
);
}

/**
 * 新建或更新网络节点
 *
 * @param data
 */
export function addOrUpdateNetWork(data: NetworkParams) {
  let url = "api/pecnode/v1/addNetWork";
  if (data.nodeId) {
    url = "api/pecnode/v1/updateNetWork";
    }
    return http.post<NodeOneExponse>(url,data)
}

/**
 * 删除网络节点
 *
 * @param data
 */
export function delNetWork(data: number[]) {
    return http.post<NodeOneExponse>('/api/pecnode/v1/delNetWork',data)
}