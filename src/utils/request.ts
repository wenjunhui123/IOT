import axios, {
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useUserStoreHook } from "@/stores/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { FullScreenLoading } from "./loading";

const loading = new FullScreenLoading();
// 创建 axios 实例
const service = axios.create({
  //   baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token;
        }
    if (config.headers.hideNotice && window.HTTP_LOADDING_COUNT === 0) {
      loading.showLoading();
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.config.headers.hideNotice) {
            loading.hideLoading();
      }
    const { code, msg } = response.data;
    if (code === "00000" || code === 0) {
      return response.data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }
    ElMessage.error(msg || "系统出错");
    Promise.reject(new Error(msg || "Error"));
    return response.data;
  },
  (error: any) => {
    loading.hideLoading();
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      if (code === "A0230") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
      } else {
        ElMessage.error(msg || "系统出错");
      }
    }
    Promise.reject(error.message);
    return error.message;
  }
);


/* 导出封装的请求方法 */
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },
  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },
  patch<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.patch(url, data, config);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

// 导出 axios 实例
export default service;
