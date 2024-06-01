/* eslint-disable camelcase */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const { Request } = require("superagent");

const { dockerReposServer } = require("./config/build.conf.js");
const { user, host, repo_name, image_max } = dockerReposServer;

function request(method, url) {
  const apiPrefix = `https://${host}/api`;
  const req = new Request(method, apiPrefix + url);
  req.auth(user.name, user.password, {
    type: "basic",
  });
  return req;
}

// 自动清理仓库的 docker 镜像-防止镜像太多将项目的存储用量使用完
async function checkAndClearImageList() {
  const list = await request(
    "get",
    `/repositories/${repo_name}/tags?detail=true`
  ).then((res) => res.body);

  // 默认所有的镜像数量总数保持在10个
  const count = (image_max || 10) - 1;
  while (list.length > count) {
    const imageItem = list.shift();
    await request(
      "delete",
      `/repositories/${repo_name}/tags/${imageItem.name}`
    );
  }
}

// 补0
function padStart(str, len) {
  if (typeof str !== "string") {
    throw new Error("padStart argument[0] must be string");
  }
  let instanc = len - str.length;
  while (instanc-- > 0) {
    str = "0" + str;
  }
  return str;
}

function parseTag(tag) {
  // let versions = tag.match(/\d+/g);
  let versions = tag.slice(1).split(".");

  let dif = 4 - versions.length;
  while (dif) {
    versions.push("0");
    --dif;
  }
  // 情况分析
  // 版本一致
  versions = versions.map((v) => {
    if (v === "{n}") {
      return "{n}";
    }
    return padStart(v, 4);
  });

  return versions;
}

function validTag(tag) {
  if (tag.charAt(0) !== "v") {
    throw new Error("tag必须位字符 v 开头");
  }
  const versions = tag.split(".");
  if (versions.length > 4 || versions.length < 2) {
    throw new Error(
      "tag版本最大支持4个版本号（v1.0.0.1/v1.0.0.{n}）, 最小支持2个版本号（v1.2/v1.{n}）!"
    );
  }

  if (~versions.slice(0, versions.length - 1).indexOf("{n}")) {
    throw new Error(
      "自动管理的版本号{n}, 只能在最后一位使用, e.g. v1.2.{n}, v1.3.1.{n}"
    );
  }
}

async function getDockRepoLastImage() {
  const imagesList = await request("get", `/logs`)
    .query({
      repository: repo_name,
      operation: "push",
      page: 1,
      page_size: 999,
    })
    .then((res) => res.body);
  // fix: 服务器时间校对时时间错乱BUG
  const _imagesList = imagesList
    .map((image) => {
      // TODO: 去除自增原则，对比根据版本号长度做一遍筛选不一致时功能适配
      const versions = parseTag(image.repo_tag);
      image.versionNum = versions.join("");
      return image;
    })
    .sort((a, b) => b.versionNum - a.versionNum);
  return _imagesList[0];
}

// 获取下一个版本的镜像信息
async function getImageNextTag() {
  const { tag } = dockerReposServer;
  // tag 有效性判断
  validTag(tag);

  const regxTag = /v(?:(\d+)\.)+{n}/;
  const isAuto = regxTag.test(tag);
  if (!isAuto) {
    return tag;
  }

  const imageLatest = await getDockRepoLastImage();

  // 对比
  let nextTag;
  if (imageLatest) {
    const versions = parseTag(tag);
    const repoVersions = parseTag(imageLatest.repo_tag);

    const difIndex = versions.indexOf("{n}");

    const versionsDiff = versions.slice(0, difIndex).join("");
    const repoVersionsDiff = repoVersions.slice(0, difIndex).join("");
    const isSame = versionsDiff === repoVersionsDiff;

    if (isSame) {
      // 修订号版本自动加一
      nextTag = tag.replace("{n}", ++repoVersions[difIndex]);
    } else {
      // 大的版本有更新重新开始版本计数
      nextTag = tag.replace("{n}", 0);
    }
  } else {
    // 初始版本
    nextTag = tag.replace("{n}", 1);
  }
  return nextTag;
}

async function getRepoProjectId() {
  const data = await request("get", `/search`)
    .query({
      q: repo_name,
    })
    .then((res) => res.body);
  const project = data.repository && data.repository[0];
  return project && project.project_id;
}

module.exports = {
  checkAndClearImageList,
  getImageNextTag,
  getRepoProjectId,
};
