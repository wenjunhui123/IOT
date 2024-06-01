import type { FormRules } from "element-plus";
import moment from "moment";

export const eventQueryTableColumn = ref([
  {
    type: "index",
    label: "序号",
    minWidth: "60px",
    align: "center",
  },
  {
    label: "发生时间",
    prop: "occurrence_time",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "200px",
    formatter: function (row: any, column: any, cellValue: any) {
      return cellValue ? moment(cellValue).format("YYYY/MM/DD HH:mm:ss") : "--";
    },
  },
  {
    label: "事件名称",
    prop: "event_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "事件类型",
    prop: "event_type",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "模拟量事件";
      } else if (cellValue === 2) {
        return "开关量事件";
      } else {
        return "--";
      }
    },
  },
  {
    label: "告警级别",
    prop: "event_level",
    align: "center",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      const arr = ["其它事件", "事故", "告警", "一般", "预警"];
      if (cellValue === 1) {
        return (
          <span class="round-[3px] inline-block  h-[28px] px-2 bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[30px]">
            其它
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] inline-block  h-[28px] px-2 bg-[#FEEFEF] text-[#F95E5A] leading-[30px]">
            事故
          </span>
        );
      } else if (cellValue === 3) {
        return (
          <span class="round-[3px] inline-block  h-[28px] px-2 bg-[rgba(252,185,44,0.1)] text-[#FCB92C] leading-[30px]">
            报警
          </span>
        );
      } else if (cellValue === 4) {
        return (
          <span class="round-[3px] inline-block  h-[28px] px-2 bg-[#E4F1FF] text-[#00A2FF] leading-[30px]">
            一般
          </span>
        );
      } else if (cellValue === 5) {
        return (
          <span class="round-[3px] inline-block  h-[28px] px-2 bg-[rgba(41,176,97,0.1)] text-[#29B061] leading-[30px]">
            预警
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "事件名称",
    prop: "event_description",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "200px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
]);

export const realTimeDataTableColumn = ref([
  {
    label: "参数ID",
    prop: "data_id",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "80px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "100px",
  },
  {
    label: "测点类型",
    prop: "property_type",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "模拟量";
      } else if (cellValue === 2) {
        return "开关量";
      } else {
        return "--";
      }
    },
  },
  {
    label: "测点名称",
    prop: "property_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "实时数据",
    prop: "realtime_data",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue || cellValue === 0) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "单位",
    prop: "unit",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },{
    label: "刷新时间",
    prop: "update_time",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "200px",
    formatter: function (row: any, column: any, cellValue: any) {
      return cellValue ? moment(cellValue).format("YYYY/MM/DD HH:mm:ss") : "--";
    },
  },
]);

export const trendCurveColumn = ref([{
    type: "index",
    label: "序号",
    minWidth: "100px",
    align: "center",
  },])