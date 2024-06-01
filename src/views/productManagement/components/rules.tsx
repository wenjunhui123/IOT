import type { FormRules } from "element-plus";
import moment from "moment";

export const mainTableColumn = ref([
  {
    label: "产品ID",
    prop: "product_id",
    width: "100px",
    align: "left",
  },
  {
    label: "产品名称",
    prop: "product_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
  },
  {
    label: "产品类型",
    prop: "product_type",
    align: "center",
    width: "110px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue === 1) {
        return (
          <span class="round-[3px] box-border inline-block w-[46px] h-[28px] px-[8px] py-[4px] bg-[rgba(231,127,188,0.1)] text-[#E77FBC] leading-[20px]">
            直采
          </span>
        );
      } else if (cellValue === 2) {
        return (
          <span class="round-[3px] box-border inline-block w-[86px] h-[28px] px-[8px] py-[4px] bg-[#E4F1FF] text-[#00A2FF] leading-[20px]">
            网关子设备
          </span>
        );
      } else {
        return "--";
      }
    },
  },
  {
    label: "驱动类型",
    prop: "driver_type_name",
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
    label: "设备类型",
    prop: "device_type_name",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "100px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return cellValue;
      } else {
        return "--";
      }
    },
  },
  {
    label: "版本状态",
    prop: "is_release",
    align: "center",
    width: "110px",
    formatter: function (row: any, column: any, cellValue: any) {
      if (cellValue) {
        return (
          <span class="round-[3px] box-border inline-block w-[60px] h-[28px] px-[8px] py-[4px] bg-[rgba(41,176,97,0.1)] text-[#29B061] leading-[20px]">
            已上线
          </span>
        );
      } else {
        return (
          <span class="round-[3px] box-border inline-block w-[60px] h-[28px] px-[8px] py-[4px] bg-[rgba(249,94,90,0.1)] text-[rgba(249,94,90,0.57)] leading-[20px]">
            未上线
          </span>
        );
      }
    },
  },
  {
    label: "创建时间",
    prop: "create_time",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      return cellValue ? moment(cellValue).format("YYYY/MM/DD HH:mm:ss") : "--";
    },
  },
  {
    label: "最后修改时间",
    prop: "update_time",
    align: "left",
    "show-overflow-tooltip": "true",
    minWidth: "150px",
    formatter: function (row: any, column: any, cellValue: any) {
      return cellValue ? moment(cellValue).format("YYYY/MM/DD HH:mm:ss") : "--";
    },
  },
]);

export interface CustomProductsRuleForm {
  product_name: string;
  description: string;
  product_id?: number;
  product_type?: number | undefined;
  driver_type?: number | undefined;
  device_type?: number | undefined;
}

export interface ImportProductsForm {
  product_src?: number;
  product_id?: number;
  product_name: string;
  driver_type?: number;
  other_product_type?: number;
  device_type?: number;
  description?: string;
  datarecmap_id?: number;
  parasetmap_id?: number;
  //   dri?: File;
  //   snf?: File;
}

export const CustomProductsFormRules = reactive<
  FormRules<CustomProductsRuleForm>
>({
  product_name: [
    {
      required: true,
      message: "请输入产品名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
        min: 1,
        max: 40,
        message: "长度在 1 到 40 个字符",
        trigger: ["blur", "change"],
      },
  ],
  product_type: [
    {
      required: true,
      message: "请选择产品类型",
      trigger: ["blur", "change"],
    },
  ],
  driver_type: [
    {
      required: false,
      message: "请选择驱动类型",
      trigger: ["blur", "change"],
    },
  ],
  device_type: [
    {
      required: false,
      message: "请选择设备类型",
      trigger: ["blur", "change"],
    },
  ],
  description: [
    {
        min: 0,
        max: 120,
        message: "长度在 1 到 120 个字符",
        trigger: ["blur", "change"],
      },
  ],
});

export const ImportProductsFormRules = reactive<FormRules<ImportProductsForm>>({
  product_src: [
    {
      required: true,
      message: "请选择产品来源",
      trigger: ["blur", "change"],
    },
  ],
  product_name: [
    {
      required: true,
      message: "请输入产品名称",
      trigger: ["blur", "change"],
    },
    {
      pattern: /^((?![`~!@$%^&*()+=[\]{}\\|;:'"<,>.?/]).)*$/, // 如果把-加进去就表示数字也算特殊字符了，所以-不能加进去
      message: "请不要输入特殊字符",
      trigger: ["blur", "change"],
    },
    {
      min: 1,
      max: 40,
      message: "长度在 1 到 40 个字符",
      trigger: ["blur", "change"],
    },
  ],
  driver_type: [
    {
      required: true,
      message: "请选择驱动类型",
      trigger: ["blur", "change"],
    },
  ],
  device_type: [
    {
      required: true,
      message: "请选择设备类型",
      trigger: ["blur", "change"],
    },
  ],
  description: [
    {
      min: 0,
      max: 120,
      message: "长度在 0 到 120 个字符",
      trigger: ["blur", "change"],
    },
  ],
});
