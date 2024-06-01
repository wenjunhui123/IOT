/**
 * @fileoverview
 * 脚本开发提取的一些默认配置项
 * NOTE：无特殊情况开发人员不需要配置此文件
 */
module.exports = {
  // docker镜像仓库
  dockerReposServer: {
    host: "10.12.135.233",
    user: {
      name: "dev",
      password: "Dev12345",
    },
    // docker仓库保存最近版本的镜像的最大数目
    image_max: 10,
  },
  // 钉钉群自定义机器人
  dingDingRobot: {
    proxy: "http://10.12.137.14:9898",
    robots: [
      {
        secret:
          "SEC0b6f90cc3b7891b787288e7c77ce8148dfa010326045a6c3248935e3f3c6c2ba",
        webhook:
          "https://oapi.dingtalk.com/robot/send?access_token=a8ccb0d67d745e82f602560329fdd39cebea2fda2c098fed515312ab1ad3a0f9",
      },
    ],
    isAtAll: false,
    // 通过手机号@相关人
    // atMobiles: ["18062123947"]
    atMobiles: [],
  },
  // sonar 质量分析平台
  sonarQubeServer: {
    origin: "http://10.12.135.234:9000",
    user: {
      name: "devops",
      password: "devops",
    },
  },
  // jenkins
  jenkinsServer: {
    host: "10.12.135.233",
    user: {
      name: "devops_web",
      password: "web",
    },
  },
};
