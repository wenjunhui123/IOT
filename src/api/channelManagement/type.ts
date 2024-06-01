export interface QueryAllStationsParam {
    page_size: number,
    page: number,
    node_name: string,
    includeInf: boolean,
}

export interface QueryStationsParam {
    page_size: number,
    page: number,
    node_name: string,
    id: number,
    includeInf: boolean,
    maxDeviceCount:number | null
}

export interface Station {
	nodeId: number;
	nodeName: string;
	nodeType: number;
	parentNodeId: number;
	parentNodeType: number;
	updateTime: number;
}

export interface InfValueList {
	delete: boolean;
	section: string;
	key: string;
	value: string;
}

export interface Channel {
	deviceCount: number;
	drvType: number;
	drvTypeName: string;
	nodeId: number;
	nodeName: string;
	nodeType: number;
	parentNodeId: number;
	parentNodeType: number;
	portType: string;
	portalMode: string;
	updateTime: number;
	comAddr: string;
	infValueList: InfValueList[];
}

export interface ChannelsResponse {
    station: Station;
	channels: Channel[];
}


export interface Drvtypes {
	nodeId: number;
	nodeName: string;
	nodeType: number;
	parentNodeId: number;
	parentNodeType: number;
	updateTime: number;
}

export interface ChannelParams {
    tenantId?: number,
    isCustomInf: boolean,
    id?:number    
}

export interface ChannelData {
    nodeId?: number,
    staName?:string,
    basicParam: BasicParam,
    comParam: ComParam,
    communicationParam: CommunicationParam,
    customInfParamList?: CustomInfParam[],
    advancedParam?: AdvancedParam,
    customInf?: string | null,
    staId:number
}

export interface BasicParam {
    drvName	: string,
    nodeName: string,
    portType: string,
    portalMode:string
}

export interface ComParam {
    baudRate?: string | number | null,
    byteSize?: string |number | null,
    parity?: string |number | null,
    portNum?: string |number | null,
    stopBits?:string |number | null
}

export interface CommunicationParam {
    port?:string | number | null,
    remoteAddr?: string | number | null
}

export interface AdvancedParam {
    adjustTimeInterval: number,
    transmitDelay: number,
    repeatTimes: number,
    writeConsoleInfo: number,
    writeDebugInfo:number
}

export interface CustomInfParam {
    key: string,
    section: string,
    value:string
}