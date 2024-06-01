const html2Md = require("html-to-md");

const { Request } = require("superagent");

const { jenkinsServer } = require("./config/build.conf.js");

// dev
// function devSetTestEnv() {
//   function setEnvDefault(key, defaultValue) {
//     process.env[key] = defaultValue;
//   }
//   const map = new Map([
//     [
//       "BUILD_URL",
//       "http://191.0.0.158:9080/view/templates%EF%BC%88%E5%8B%BF%E5%8A%A8%EF%BC%89/job/template-web-frame/68/"
//     ],
//     ["JENKINS_URL", "http://191.0.0.158:9080/"],
//     ["BUILD_NUMBER", "68"],
//     ["JOB_NAME", "template-web-frame"],
//     [
//       "JOB_URL",
//       "http://191.0.0.158:9080/view/templates%EF%BC%88%E5%8B%BF%E5%8A%A8%EF%BC%89/job/template-web-frame/"
//     ],
//     ["TFS_SERVERURL", "https://cetsoft-svr1/Platforms/"],
//     [
//       "TFS_PROJECTPATH",
//       "$/PLT-Matterhorn/base/dev/v1.0/2.src/matterhorn/uiframe/webframe/v3-test/webframe/frame"
//     ],
//     [
//       "GIT_URL",
//       "https://cetsoft-svr1/Solutions/BIZ-%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%BF%83/_git/web-dcim"
//     ],
//     ["GIT_BRANCH", "origin/master"]
//   ]);
//   map.forEach((value, key) => {
//     setEnvDefault(key, value);
//   });
// }
// devSetTestEnv();

// jenkins env
const BUILD_URL = process.env["BUILD_URL"];
const JENKINS_URL = process.env["JENKINS_URL"];
const BUILD_NUMBER = process.env["BUILD_NUMBER"];
const JOB_NAME = process.env["JOB_NAME"];
const JOB_URL = process.env["JOB_URL"];

function request(method, url) {
  const req = new Request(method, url);
  req.auth(jenkinsServer.user.name, jenkinsServer.user.password, {
    type: "basic"
  });
  return req;
}

function getBuildInfoUrl(buildNum) {
  return `${JOB_URL}/${buildNum}/api/json`;
}

function getCommitUrl(changeSetItem) {
  const map = {
    Git: function (commitId) {
      const GIT_URL = process.env["GIT_URL"];
      const GIT_BRANCH = process.env["GIT_BRANCH"];

      return `${GIT_URL}/commit/${commitId}?refName=refs/heads/${GIT_BRANCH}`;
    },
    TFS: function (commitId) {
      const TFS_SERVERURL = process.env["TFS_SERVERURL"];
      const TFS_PROJECTPATH = process.env["TFS_PROJECTPATH"];
      if (!TFS_PROJECTPATH) {
        return "";
      }
      const projectName = TFS_PROJECTPATH.split("/")[1];

      return `${TFS_SERVERURL}${projectName}/_versionControl/changeset/${commitId}`;
    }
  };
  switch (changeSetItem._class) {
    // TFS
    case "hudson.plugins.tfs.model.ChangeSet":
      return map["TFS"](changeSetItem.commitId);
    // GIT
    case "hudson.plugins.git.GitChangeSet":
      return map["Git"](changeSetItem.commitId);
  }
}

async function getChangeSetItems() {
  let buildNum = BUILD_NUMBER;
  // 获取本次构建的提交记录
  const res = await request("get", getBuildInfoUrl(buildNum));
  const changeSetItems = res.body.changeSet.items || [];

  // 获取从上次构建成功到前一次的构建记录
  // eslint-disable-next-line no-constant-condition
  while (true) {
    --buildNum;
    try {
      const res = await request("get", getBuildInfoUrl(buildNum));
      const data = res.body;

      if (data.result === "SUCCESS") {
        break;
      } else {
        const record = data.changeSet.items;
        changeSetItems.push(...record);
      }
    } catch (e) {
      break;
    }
  }

  return changeSetItems;
}

async function getChangeLog() {
  const changeSetItems = await getChangeSetItems();
  const md = ["---", `**变更记录**  `];
  if (!changeSetItems.length) {
    md.push("无代码提交记录");
  } else {
    const itemsHTML = changeSetItems
      .map(item => {
        const commitUrl = getCommitUrl(item);
        if (!commitUrl) return "";
        return `<li> ${item.msg} <a href="${commitUrl}">Azure -> diff</a></li>`;
      })
      .filter(text => text)
      .join("");
    md.push(html2Md(`<ul>${itemsHTML}</ul>`));
  }

  return JSON.stringify(md);
}

module.exports = {
  getChangeLog,
  BUILD_URL,
  JENKINS_URL,
  JOB_NAME,
  JOB_URL
};
