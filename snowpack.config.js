// @ts-check
/// <reference lib="es2018" />

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig} */
const config = {
  // Create React App のフォルダー構成に近づける。
  mount: {
    "./public/": { url: "/" },
    "./src/": { url: "/dist/" },
  },

  plugins: [
    // .env.development, .env.production から環境変数を読み込む。
    "@snowpack/plugin-dotenv",

    // TypeScript の型チェックを実行する。
    "@snowpack/plugin-typescript",
  ],

  devOptions: {
    // Create React App のデフォルトのポートと同じにする。
    port: 3000,

    // 自動でブラウザーを開きたくないときは open=none を指定する。
    // もしくは CLI オプションで `--open none` を渡す。
    // e.g.) $ npm start -- --open none
    // open: "none",
  },

  routes: [
    // Single page application として起動するため、拡張子なしのリクエストは index.html の内容を返す。
    // https://www.snowpack.dev/guides/routing#scenario-1%3A-spa-fallback-paths
    { match: "routes", src: ".*", dest: "/index.html" },
  ],

  buildOptions: {
    // Create React App のデフォルトの出力先と同じにする。
    out: "./build/",

    // デバッグのためソースマップを有効にしておく。
    sourcemap: true,
  },
}

module.exports = config
