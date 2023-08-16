// eslint-disable-next-line no-undef
module.exports = {
  darkMode: "class",
  // prefix: "tw-", //前缀仅会被添加到 Tailwind 生成的类中；您自己的自定义类中将不会被添加前缀
  content: ["./src/**/*.{vue,html,js,jsx,md,tsx}"],
  theme: {
    // 扩展 间距、阴影等，如不包含在exrend中，则直接覆盖 bg-ZS
    extend: {
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
      // 默认间距和大小比例
      spacing: {
        // 间距
        J1: "var(--J1)",
        J2: "var(--J2)",
        J3: "var(--J3)",
        J4: "var(--J4)",
        // 图标
        I1: "var(--I1)",
        I2: "var(--I2)",
        I3: "var(--I3)",
        I4: "var(--I4)",
        I5: "var(--I5)",
        22: "88px",
      },
      fontSize: {
        H: "var(--H)",
        H1: "var(--H1)",
        H2: "var(--H2)",
        H3: "var(--H3)",
        Aa: "var(--Aa)",
        Ab: "var(--Ab)",
      },
      boxShadow: {
        // 阴影
        // 强投影
        S1: "var(--S1)",
        // 浅色投影
        S2: "var(--S2)",
      },
      borderRadius: {},
    },
    fontFamily: {
      title: ["SimHei", "Microsoft YaHei"],
      dinpro: ["dinpro"],
      youshe: ["YouSheBiaoTiHei"],
      arial: ["Arial"],
    },
  },
  plugins: [],
  corePlugins: {
    // 禁用 Tailwind 项目预设的基础样式
    preflight: false,
  },
};
