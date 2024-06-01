interface PageQuery  {
    page_size: number,
    page:number
}

/**
 * 用户查询对象类型
 */
export interface nodeQuery extends PageQuery {
    node_name?:string
}


export interface Data {
	nodeId?: number;
	nodeName: string;
    netWorkNodeType?: number[] | string[];
    typeList:number[] | string[];
	computerName: string;
	ipAddr1: string;
	ipAddr2: string;
	staId: number;
}

export interface NodeExponse {
	code: number;
	msg: string;
	data: Data[];
	success: boolean;
	total: number;
}

export interface NodeOneExponse {
	code: number;
	msg: string;
	data: Data | null;
	success: boolean;
	total: number;
}
