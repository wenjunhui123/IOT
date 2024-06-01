module.exports = {
  msgtype: "markdown",
  markdown: {
    title: "版本发布(前端) {{nextTag}} ",
    text: [
      "# 版本发布(前端) {{nextTag}}",
      "- {{repo_name}}:{{nextTag}}",
      "- [docker -> 镜像仓库：]({{repoImageUrl}})",
      "- [jenkins -> 构建日志]({{logUrl}})",
      "- [sonar -> 代码质量报告]({{sonarCodeReoportUrl}})",
      "---",
      "- **镜像下载**  [点击下载镜像]({{downloadRepoImageUrl}})",
    ].concat({{changeLog}}).join("\n")
  },
  at: {
    isAtAll: {{isAtAll}}
  }
};
