const { pushToRobots } = require("../dingding");
const { dingDingRobot } = require("../config/build.conf");

const { atMobiles } = dingDingRobot;
const path = require("path");

const dingdingMsg = require(path.resolve(__dirname, "../", "dingDingMsg.js"));
const title = dingdingMsg.markdown.title;
pushToRobots(dingdingMsg);

if (atMobiles && atMobiles.length) {
  const atUsersContent = atMobiles.map(phoneNum => `@${phoneNum}`).join(" ");
  pushToRobots({
    msgtype: "text",
    text: {
      content: `${title} ${atUsersContent}`
    },
    at: {
      atMobiles: atMobiles
    }
  });
}
