/// <reference lib="es2019" />
import reactRefresh from "@vitejs/plugin-react-refresh"
import tscPlugin from "vite-plugin-tsc"

const { BROWSER, HOST, PORT, BUILD_PATH } = process.env

/** @type {import("vite").UserConfigFn} */
const config = ({ command }) => ({
  plugins: [
    // Fast Refresh の機能を有効にする。
    reactRefresh(),

    // サーバー起動と同時に tsc コマンドで型を検査する。
    tscPlugin(),
  ],

  // tsc コマンドの出力があるので Vite からの出力はなくす。
  logLevel: command === "serve" ? "silent" : "info",

  esbuild: {
    // react-jsx 形式の JSX 変換が扱えないビルドツールで擬似的に react-jsx 形式を実現するためのハック。
    // 擬似的というのは、import React をしないでいいというソースコード観点しか満たせず、JSX 変換後の動作効率の点は満たせないということ。
    jsxFactory: "_implicit_React.createElement",
    jsxFragment: "_implicit_React.Fragment",
    jsxInject: 'import _implicit_React from "react"',
  },

  server: {
    // localhost 以外で起動したい場合は指定する。
    host: HOST || "localhost",

    // Create React App のデフォルトのポートと同じにする。
    port: (PORT && parseInt(PORT)) || 3000,

    // 自動でブラウザーを開きたくないときは open=false を指定する。
    // もしくは CLI オプションで `--no-open` を渡す。
    // e.g.) $ npm start -- --no-open
    open: BROWSER || true,
  },

  build: {
    // Create React App のデフォルトの出力先と同じにする。
    outDir: BUILD_PATH || "./build/",

    // デバッグのためソースマップを有効にしておく。
    sourcemap: true,
  },
})

export default config
