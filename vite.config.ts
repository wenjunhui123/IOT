import { fileURLToPath, URL } from "node:url";

import { type UserConfig, type ConfigEnv, defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import { viteMockServe } from "vite-plugin-mock";
import visualizer from "rollup-plugin-visualizer";

import UnoCSS from "unocss/vite";
import presetUno from "@unocss/preset-uno";

import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      UnoCSS({ presets: [presetUno()] }),
      vueJsx(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core"],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          IconsResolver({}),
        ],
        vueTemplate: true,
        // 配置文件生成位置(false:关闭自动生成)
        dts: false,
        // dts: "src/types/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            // @iconify-json/ep 是 Element Plus 的图标库
            enabledCollections: ["ep"],
          }),
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/**/components"],
        // 配置文件位置(false:关闭自动生成)
        dts: false,
        // dts: "src/types/components.d.ts",
        directoryAsNamespace: true, //  <------ 这里
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
      // 代码压缩
      viteCompression({
        verbose: true, // 默认即可
        disable: true, // 是否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
        deleteOriginFile: true, // 删除源文件
        threshold: 10240, // 压缩前最小文件大小
        algorithm: "gzip", // 压缩算法
        ext: ".gz", // 文件类型
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        ignore: /^\_/,
        mockPath: "mock",
        // enable: mode === "development",
        // https://github.com/anncwb/vite-plugin-mock/issues/9
      }),
      visualizer({
        filename: "./stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
        target: ["edge90", "chrome90", "firefox90", "safari15"],
        outDir: process.env.BUILD_OUTPUT_DIR || "dist",
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;@import "@/resources/_handle.scss";`,
        },
      },
      // 可以查看 CSS 的源码
      devSourcemap: true,
    },
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "@vueuse/core",
        "sortablejs",

        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "codemirror",
      ],
    },
    server: {
      port: 6553,
      open: false,
      proxy: {
        // 反向代理解决跨域
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_TARGET_URL,
          changeOrigin: true,
          rewrite: (path: string) =>
            path.replace(
              new RegExp("^" + env.VITE_APP_BASE_API),
              env.VITE_APP_TARGET_BASE_API
            ), // 替换 /dev-api 为 target 接口地址
        },
        "^/lyd-api/": {
          target: "http://172.17.6.205:4120",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lyd-api/, "/api"),
        },
        "^/hcc-api-device/": {
          target: "http://172.17.6.201:9995",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hcc-api-device/, "/api"),
        },
        "^/wjh-api-device/": {
          target: "http://127.0.0.1:9995",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/wjh-api-device/, "/api"),
        },
        "^/hcc-api/": {
          target: "http://172.17.6.201:4120",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hcc-api/, "/api"),
        },
        "^/shh-api/": {
          target: "http://10.12.135.92:9995",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/shh-api/, "/api"),
          },
          "^/wxx-api/": {
            target: "http://172.17.6.221:4119",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/wxx-api/, "/api"),
          },
        "^/api/": {
          target: "http://172.17.6.148:4120",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
      }
  };
});
