import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()// 自动导入图标组件
      ,IconsResolver({})],
    }),
    Components({
      resolvers: [ElementPlusResolver(),// 自动注册图标组件
      IconsResolver({
        enabledCollections: ["ep"] // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
      })],
    }),
    Icons({
        // 自动安装图标库
        autoInstall: true,
    }),
    createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
    })
  ],
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
                additionalData: `@use "@/styles/variables.scss" as *;`
            }
        }
    },
    server: {
        port: 6553,
        open: true,
       proxy: {}
    }
});
