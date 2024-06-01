import { ElLoading } from "element-plus";

window.HTTP_LOADDING_COUNT = 0;

let loadingInstance:any = null;
export class FullScreenLoading {
    showLoading() {
    if (window.HTTP_LOADDING_COUNT === 0) {
      loadingInstance = ElLoading.service(
          {
          lock: true,
          fullscreen: true,
          text: "加载中……",
          background: "rgba(255, 255, 255, 0.5)"
        }
      );
    }
    window.HTTP_LOADDING_COUNT++;
  }

    hideLoading() {
    window.HTTP_LOADDING_COUNT--;
    if (window.HTTP_LOADDING_COUNT === 0) {
      loadingInstance.close();
      loadingInstance = null;
      return true;
    }
    // 重置
    if (window.HTTP_LOADDING_COUNT < 0) {
        window.HTTP_LOADDING_COUNT = 0;
    }
  }
}