#!/usr/bin/env node
/* eslint-disable camelcase */

/**
 * @fileoverview 自动更新版本号-修订版本号自动加一
 */
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const path = require("path");

const buildConf = require("./config/build.conf.js");

const {
  checkAndClearImageList,
  getImageNextTag,
  getRepoProjectId,
} = require("./dockerRepo");

const { getChangeLog, BUILD_URL, JOB_NAME } = require("./jenkins");
const { generateFileByTpl } = require("./util");

const { dockerReposServer, sonarQubeServer, dingDingRobot } = buildConf;

function resolve(filePath) {
  return path.join(__dirname, filePath);
}

async function init() {
  await checkAndClearImageList();
  const nextTag = await getImageNextTag();
  const project_id = await getRepoProjectId();

  const { repo_name, host, user } = dockerReposServer;

  // dev_ops/docker_build.sh
  generateFileByTpl(
    resolve("tpl/docker_build.sh.tpl"),
    {
      repo_name,
      host,
      nextTag,
      user: user.name,
      password: user.password,
    },
    resolve("./docker/docker_build.sh")
  );

  // dev_ops/sonar.properties
  const projectKey = repo_name.split("/").join("-");
  generateFileByTpl(
    resolve("tpl/sonar.properties.tpl"),
    {
      projectName:
        JOB_NAME + " ->> " + repo_name + " ( web front end's devops )",
      projectKey,
      projectVersion: nextTag,
    },
    resolve("sonar.properties")
  );

  // dev_ops/dingding.json
  const { isAtAll } = dingDingRobot;
  const changeLog = await getChangeLog();
  generateFileByTpl(
    resolve("tpl/dingDingMsg.js.tpl"),
    {
      repo_name,
      nextTag,
      logUrl: BUILD_URL + "console",
      sonarCodeReoportUrl: `${sonarQubeServer.origin}/dashboard?id=${projectKey}`,
      repoImageUrl: `https://${host}/harbor/projects/${project_id}/repositories/${encodeURIComponent(
        repo_name
      )}`,
      changeLog,
      // http://localhost:3000/docker/export?host=191.0.0.158&tag=v0.0.1&repoName=front-frame%2Fweb-frame
      downloadRepoImageUrl: [
        `http://172.16.6.26:7777/docker/export?`,
        `host=${encodeURIComponent(host)}&`,
        `tag=${encodeURIComponent(nextTag)}&`,
        `repoName=${encodeURIComponent(repo_name)}`,
      ].join(""),
      isAtAll: isAtAll,
    },
    resolve("dingDingMsg.js")
  );
  // dev_ops/inject_env_vars.properties
  generateFileByTpl(
    resolve("tpl/inject_env_vars.properties.tpl"),
    {
      nextTag,
      imageName: `${host}/${repo_name}`,
    },
    resolve("inject_env_vars.properties")
  );
}

init();
