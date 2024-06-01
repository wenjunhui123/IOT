const fs = require("fs");

function replaceMacro(str, obj) {
  return str.replace(/{{(\w+)}}/g, function (matchStr, prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (!obj.hasOwnProperty(prop)) {
      throw new Error(
        `宏替换对象属性 [${prop}] 不存在，请检查配置项` + "\n" + str
      );
    }
    return obj[prop];
  });
}

function generateFileByTpl(tplPath, macroObj, dist) {
  const tpl = fs.readFileSync(tplPath, "utf8");
  const file = replaceMacro(tpl, macroObj);

  if (fs.existsSync(dist)) {
    fs.unlinkSync(dist);
  }

  fs.writeFileSync(dist, file);
}

module.exports = { generateFileByTpl, replaceMacro };
