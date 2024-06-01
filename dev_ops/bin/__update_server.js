// 脚本代码留存
const http = require("http");
const path = require("path");
const fs = require("fs");

const AUTHORIZATION =
  "Basic " + Buffer.from("devops_web:web").toString("base64");
const INJECT_VARS_FILE = "inject_env_var_update_server.properties";

const INJECT_VARS_FILE_PATH = path.resolve(
  process.env["WORKSPACE"],
  INJECT_VARS_FILE
);
// 测试
// function devSetTestEnv() {
//   function setEnvDefault(key, defaultValue) {
//     process.env[key] = defaultValue;
//   }
//   const map = new Map([
//     ["JENKINS_URL", "http://191.0.0.158:9080/"],
//     ["BUILD_NUMBER", "3"],
//     ["JOB_NAME", "todo-web-template-server-update"]
//   ]);
//   map.forEach((value, key) => {
//     setEnvDefault(key, value);
//   });
// }
// devSetTestEnv();

const JENKINS_URL = process.env["JENKINS_URL"];
const BUILD_NUMBER = process.env["BUILD_NUMBER"];
const JOB_NAME = process.env["JOB_NAME"];

function http_get(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      url,
      {
        headers: {
          Authorization: AUTHORIZATION
        }
      },
      res => {
        if (res.statusCode === 200) {
          res.setEncoding("utf8");
          let rowData = "";
          res.on("data", chunk => {
            rowData += chunk;
          });
          res.on("end", () => {
            try {
              const data = JSON.parse(rowData);
              resolve(data);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          console.log(req);
          reject(res.statusCode);
        }
      }
    );
    req.on("error", e => {
      reject(e);
    });
  });
}

function getBuildInfoUrl(jobName, buildNum) {
  return `${JENKINS_URL}/job/${jobName}/${buildNum}/api/json`;
}

function getInjectEnvVarsUrl(jobName, buildNum) {
  return `${JENKINS_URL}/job/${jobName}/${buildNum}/injectedEnvVars/api/json`;
}

async function start() {
  // 获取本次构建触发的构建任务
  const res = await http_get(getBuildInfoUrl(JOB_NAME, BUILD_NUMBER));
  const actions = res.actions;

  const causeAction = actions.find(
    t => t._class === "hudson.model.CauseAction"
  );
  const upstreamCause =
    causeAction &&
    causeAction.causes.find(
      t => t._class === "hudson.model.Cause$UpstreamCause"
    );
  if (upstreamCause) {
    // 获取触发器任务的镜像名称
    const res = await http_get(
      getInjectEnvVarsUrl(
        upstreamCause.upstreamProject,
        upstreamCause.upstreamBuild
      )
    );
    const envMap = res.envMap;
    const DEVOPS_IMAGE_FULL = envMap["DEVOPS_IMAGE_FULL"];
    const DEVOPS_IMAGE_NAME = envMap["DEVOPS_IMAGE_NAME"];

    fs.writeFileSync(
      INJECT_VARS_FILE_PATH,
      [
        `DEVOPS_IMAGE_FULL=${DEVOPS_IMAGE_FULL}`,
        `DEVOPS_IMAGE_NAME=${DEVOPS_IMAGE_NAME}`
      ].join("\n")
    );
    console.info(INJECT_VARS_FILE_PATH, "变量注入文件生成");
  } else {
    console.info("查询不到上游触发任务信息！");
  }
}

start();
