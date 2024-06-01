import { defineConfig, presetAttributify, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify({
      /* 预设选项 */
    }),
    presetUno(),
    // ...自定义预设
  ],
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { color: theme.colors[c] };
      },
    ],
  ],
  theme: {
    colors: {
      /* 主色 */
      ZS: "var(--ZS)",
      /* 辅助色1 */
      F1: "var(--F1)",
      /* 辅助色2 */
      F2: "var(--F2)",
      // 成功
      Sta1: "var(--Sta1)",
      Sta1_OPACITY: "var(--Sta1_OPACITY)",
      // 警告
      Sta2: "var(--Sta2)",
      Sta2_OPACITY: "var(--Sta2_OPACITY)",
      // 危险
      Sta3: "var(--Sta3)",
      Sta3_OPACITY: "var(--Sta3_OPACITY)",
      // 一般
      Sta4: "var(--Sta4)",
      // 次要
      Sta5: "var(--Sta5)",
      Sta5_OPACITY: "var(--Sta5_OPACITY)",
      // 状态
      Sta6: "var(--Sta6)",
      Sta6_OPACITY: "var(--Sta6_OPACITY)",
      // >>>> 文字色
      // 主要
      T1: "var(--T1)",
      // 常规
      T2: "var(--T2)",
      // 次要
      T3: "var(--T3)",
      // 占位
      T4: "var(--T4)",
      // 带背景的文字色
      T5: "var(--T5)",
      // >>>> 边框色
      // 主要
      B1: "var(--B1)",
      // 次要
      B2: "var(--B2)",
      // >>>> 背景色
      BG: "var(--BG)",
      // 主要
      BG1: "var(--BG1)",
      // 滑入
      BG2: "var(--BG2)",
      // 点击
      BG3: "var(--BG3)",
      // 选中
      BG4: "var(--BG4)",
    },
    fontFamily: {
      londrina: ["PingFang SC"],
    },
  },
});
