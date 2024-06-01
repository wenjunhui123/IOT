## sonar 代码检查

(非严格) devops:eslint_report
(严格) devops:eslint_report:block -> 代码中如果有错误会中断程序执行（应用：代码检查不通过不让打包）

## 打包过程 sonar 报错导致打包失败原因分析

可能原因：eslint 生成的报告中有错误等级的报错，运行 `npm run eslint:fix`

## 主要流程：将生成的 eslit 报告（json格式）推送到sonarqube平台，sonar 平台会根据此json报告数据分析
