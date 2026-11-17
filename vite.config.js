import { fileURLToPath, URL } from 'node:url'

import { resolve } from "path"
import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"


// CMD_LOCAL_SIBLINGS=1: resolve sibling packages from the local repos (dist) instead of the installed registry copies (used by E:/CoManD-UI/tools checks)
// The dev server (and the checks) must use the local framework by default: the components rely on its current tokens, an older installed copy renders them wrongly (e.g. black accordion headlines).
// Opt out with CMD_LOCAL_SIBLINGS=0.
const localFrameworkAvailable = existsSync(resolve(__dirname, "../comand-frontend-framework/dist/style.css"))
const localSiblings = process.env.CMD_LOCAL_SIBLINGS === "1" || (process.env.CMD_LOCAL_SIBLINGS !== "0" && localFrameworkAvailable)
const siblingAliases = localSiblings ? [
  { find: /^comand-frontend-framework\/styles\.css$/, replacement: resolve(__dirname, "../comand-frontend-framework/dist/style.css") },
  { find: /^comand-frontend-framework\/(material-web|neumorphic|tailwind)\.css$/, replacement: resolve(__dirname, "../comand-frontend-framework/dist/templates/$1.css") },
  { find: /^comand-frontend-framework\/demopage-only\.css$/, replacement: resolve(__dirname, "../comand-frontend-framework/dist/demopage-only.css") },
  { find: /^comand-component-library\/css\.js$/, replacement: resolve(__dirname, "./src/css.js") },
  { find: /^comand-component-library\/comand-component-library\.css$/, replacement: resolve(__dirname, "./dist/comand-component-library.css") },
  { find: /^comand-component-library$/, replacement: resolve(__dirname, "./dist/comand-component-library.js") }
] : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      Components({
        dirs: ["src/components", "src/pages"]
      })
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      ...siblingAliases
    ]
  },
  server: { fs: { allow: localSiblings ? [resolve(__dirname, "..")] : undefined } },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "comand-component-library",
      fileName: "comand-component-library",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
})
