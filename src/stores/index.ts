import { useAppStore } from "./modules/app";


// 统一导出useStore方法
export function useStore() {
  return {
    app: useAppStore(),
  };
}
