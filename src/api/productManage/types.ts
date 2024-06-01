export interface ProductUniversalQuery {
    page_size: number;
    page: number;
}

export interface PageMainQuery {
    page_size: number;
    page: number;
    key_name: string;
}

export interface MainProductData {
    [x: string]: any;
    product_id: number;
    product_name: string;
    product_src: number;
    create_time: number;
    description: string;
    product_type: number;
    driver_type?: number;
    device_type?: number;
}

export interface ProductDataInfo {
    [x: string]: any;
    product_id: number;
    product_name: string;
    product_type: number;
    device_type?: string;
    driver_type?: string;
    driver_type_name: string;
    is_release: boolean;
    product_uuid: string;
    product_version: string;
    version: number;
    update_time: number;
    create_time: number;
    description: string;
}

export interface ProductPropertyQuery {
    page_size: number;
    page: number;
    property_type: number;
    property_name: string;
}

export interface ProductPropertyResponse {
    property_id: number;
    property_name: string;
    property_type: number;
    para_handle: number;
    data_id: number;
    data_name: string;
    logical_id: number | undefined;
    property_option: {
        min?: number;
        max?: number;
        amp?: number;
        div?: number;
        reverse?: boolean | number;
        scaling_factor?: number;
        unit?: string;
    };
}

export interface CreateOrEditProduct {
    product_name: string;
    product_id?: number;
    description: string;
    product_type?: number;
    driver_type?: number;
    device_type?: number;
}

export interface CreateOrEditProductPropertyQuery {
    property_id?: number;
    property_name: string;
    property_type: number;
    para_handle: number;
    data_id?: number | undefined;
    data_name?: string;
    logical_id?: number | undefined;
    property_option: {
        min?: number;
        max?: number;
        amp?: number;
        div?: number;
        reverse?: boolean | number;
        scaling_factor?: number;
        unit?: string;
    };
}

export interface ParameterProductRes {
    data_id: number;
    data_name: string;
}

export interface ProductRemoteQuery {
    page_size: number;
    page: number;
    action_type: number;
    service_name: string;
}

export interface ProductRemoteResponse {
    service_id: number;
    service_name: string;
    action_type: number;
    para_handle: number;
    data_id: number;
    data_name: string | undefined;
    date_name?: string | undefined;
    logical_id: number | undefined;
}

export interface CreateOrEditProductRemoteQuery {
    service_name: string;
    service_id?: number;
    action_type: number;
    para_handle: number;
    data_id?: number;
    data_name?: string | undefined;
    logical_id?: number | undefined;
}

export interface ProductRecordResponse {
    para_handle: number;
    data_id: number;
    data_name: string;
    logical_id: number | undefined;
    datatype_id: number;
    datatype_name: string;
    paratype_id: number;
    paratype_name: string;
}

export interface ProductAlarmTemplateResponse {
    strategy_id: number;
    strategy_name: string;
    is_release: boolean;
}

export interface CreateOrEditProductAlarmTemplateQuery {
    strategy_name: string;
    strategy_id?: number;
}

export interface ProductAlarmQuery {
    page_size: number;
    page: number;
    event_type?: number;
    event_level?: number;
    para_name?: string;
}

export interface ProductAlarmResponse {
    event_id: number;
    event_desc: string;
    event_type: number;
    para: number;
    para_name: string;
    action_type: number;
    event_level: number;
    param1: number;
    param2: number;
    action_delay: number;
    return_delay: number;
    need_save: boolean;
}

export interface CreateOrEditProductAlarmQuery {
    event_id?: number;
    event_type?: number;
    event_level?: number;
    action_type?: number;
    param1?: number;
    param2?: number;
    action_delay?: number;
    return_delay?: number;
    event_desc: string;
    para?: number | number[];
    need_save: boolean;
}

export interface ProductSnapshotStrategyResponse {
    interval: number;
    flag: boolean;
}

export interface ProductSnapshotTableResponse {
    newSelected?: boolean;
    newDeleted?: boolean;
    flag?: boolean;
    property_id?: number;
    property_name: string;
    para_handle: number;
    property_type: number;
    data_id: number;
    data_name: number;
    logical_id: number | undefined;
}

export interface ProductVersionResponse {
    product_id: number;
    product_version: string;
}

export interface ProductConfigurationResponse {
    config_name: string;
    config_id: number;
    common_inf: string;
}

export interface DataMenuResponse {
    length: boolean;
    map(
        arg0: (item: any) => {
            menu_id: any;
            menu_name: any;
            is_leaf: any;
            children: never[] | undefined;
        }
    ): unknown;
    [x: string]: boolean;
    menu_id: number;
    menu_name: string;
    is_leaf: boolean;
}

export interface DataIdResponse {
    data_id: number;
    data_name: string;
}

export interface ImportDriQuery {
    product_name: string;
    description: string;
    dri: Blob;
}

export interface ImportDriverQuery {
    product_name: string;
    description: string;
    driver_type: number;
    device_type: number;
    datarecmap_id: number;
    parasetmap_id: number;
    snf: Blob;
}

export interface DataLogSolutionMapResponse {
    data_log_map_id: number;
    data_log_map_name: string;
}

export interface EventModelStationsQuery {
    product_id: number;
    event_model_id: number;
}

export interface EventModelStationsResponse {
    station_id: number;
    station_name: string;
    has_event: boolean;
}

export interface EventModelChannelsQuery {
    product_id: number;
    event_model_id: number;
    station_id: number;
}

export interface EventModelChannelsResponse {
    channel_id: number;
    channel_name: string;
    has_event: boolean;
}

export interface EventModelDevicesQuery {
    product_id: number;
    event_model_id: number;
    channel_id: number;
}

export interface EventModelDevicesResponse {
    device_id: number;
    device_name: string;
    has_event: boolean;
}

export interface EventModelDevicesTreeResponse {
    stations: {
        station_id: number;
        station_name: string;
        channels: {
            channel_id: number;
            channel_name: string;
            devices: {
                device_id: number;
                device_name: string;
                has_event: boolean
            }[]
        }[];
    }[]
}

export interface EventModelDevicesCreateOrDeleteQuery {
    product_id: number;
    event_model_id: number;
    device_ids: number[];
}


