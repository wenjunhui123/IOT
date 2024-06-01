export const tableColumn = ref([
  {
    type: "index",
    label: "序号",
    minWidth: "80px",
    align: "center",
  },
  {
    label: "定时记录名称",
    prop: "data_log_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "参数号",
    prop: "para_handle",
    align: "left",
    minWidth: "150px",
  },
  {
    label: "映射方案类型",
    prop: "paratype_id",
    align: "left",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return "定时记录";
      } else if (cellValue === 3) {
        return "越限参数";
      } else if (cellValue === 5) {
        return "高速定时记录";
      } else if (cellValue === 6) {
        return "秒级定时记录";
      } else {
        return "--";
      }
    },
  },
  {
    label: "参数名称",
    prop: "data_name",
    align: "left",
    minWidth: "150px",
  },
  {
    label: "参数类型",
    prop: "datatype_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "回路号",
    prop: "logical_id",
    align: "left",
    minWidth: "150px",
  },
]);
