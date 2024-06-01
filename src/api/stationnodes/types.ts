export interface PageQuery  {
    page_size: number,
    page: number,
    node_name:string
}

export interface NodeStation {
	nodeId: number;
	nodeName: string;
	nodeType: number;
	parentNodeId: number;
	parentNodeType: number;
    updateTime?: number;
    typeId: number;
    typeName?:string
}