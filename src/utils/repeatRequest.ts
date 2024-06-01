export class RepeatRequest {
  reqList: string[] = [];
  /**
   * 阻止重复请求
   * @param {array} reqList - 请求缓存列表
   * @param {string} url - 当前请求地址
   */
  isRepeatRequest = (reqList: string[], url: string) => {
    if (reqList.includes(url)) {
      return true;
    }
    return false;
  };
    
  // 请求成功删掉队列中的请求
  removeFinishedRequest = (reqList: string[], url: string) => {
    reqList = reqList.filter((item) => item !== url);
    return reqList;
  };

  // 生成用于对比的url  url + method + data + params
  getCheckRepeatRequestUrl = (
    url: string,
    method: string,
    data: any,
    params: any
  ) => {
    return `${url}&&&${method}&&&${JSON.stringify(data)}&&&${JSON.stringify(
      params
    )}`;
  };
}
