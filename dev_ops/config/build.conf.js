const lodash = require("lodash");
const defaults = require("./build.conf.default");

module.exports = lodash.merge(defaults, {
  dockerReposServer: {
    // 镜像仓库名称
    repo_name: "iot/iot-web",
    // 重要说明：
    // 版本号支持 2~4位版本号，以4位版本号为例 v1.3.1.{n}, {n}会根据镜像私库的近999条版本号进行排序，计算出其下一个版本号的{n}。
    // {n} 仅支持放在最后一位。
    // 如需要手动管理版本号只需要将{n}替换成想要的版本即可。例如v1.3.1.13代表我推送到镜像库的为v1.3.1.13版本
    // 详细见代码 ../dockerRepo.js
    tag: "v1.1.{n}",
  },
  dingDingRobot: {
    // 钉钉自定义机器人
    robots: [
      {
        secret:
          "SECef3b05ea036c3b5bbd3159d96def0955fae3fbf5d97ebb0b4e7ffd358aa48d84",
        webhook:
          "https://oapi.dingtalk.com/robot/send?access_token=1dcb6b55cb0fb592fb71ddeecfdd15b209c2f8e11380942a114230fbec6fcff2",
      },
    ],
    // isAtAll: false,
    // 通过手机号@相关人
    // atMobiles: []
  },
});
