const { dingDingRobot } = require("./config/build.conf.js");

const crypto = require("crypto");

const superagent = require("superagent");
require("superagent-proxy")(superagent);

async function pushToDingDingRobot(url, message, { secret }) {
  const req = new superagent.Request("POST", url);
  const timestamp = Date.now();
  const sign = encodeURIComponent(
    crypto
      .createHmac("sha256", secret)
      .update(timestamp + "\n" + secret)
      .digest("base64")
  );
  req.query({
    timestamp,
    sign
  });
  req.proxy(dingDingRobot.proxy);
  req.send(message);
  return req;
}

function handlerRetryPush() {
  let count = 0;
  return async function send(webhook, message, secret) {
    try {
      const res = await pushToDingDingRobot(webhook, message, {
        secret
      });
      if (res.body.errcode !== 0) {
        console.error("推送失败:", res.body);
      }
    } catch (e) {
      // 重发
      if (count++ < 2) {
        await send(webhook, message, secret);
      }
      console.error("无法推送，请检查代理是否正常", e);
    }
  };
}

function pushToRobots(message) {
  dingDingRobot.robots.forEach(async ({ secret, webhook }) => {
    await handlerRetryPush()(webhook, message, secret);
  });
}

module.exports = {
  pushToDingDingRobot,
  pushToRobots
};
