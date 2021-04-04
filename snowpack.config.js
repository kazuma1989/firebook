/// <reference lib="es2018" />

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const { BROWSER, HOST, PORT, BUILD_PATH } = process.env

/** @type {import("snowpack").SnowpackUserConfig} */
const config = {
  // Create React App のディレクトリ構成に近づける。
  mount: {
    "./public/": { url: "/" },
    "./src/": { url: "/dist/" },
  },

  plugins: [
    // .env.development, .env.production から環境変数を読み込む。
    "@snowpack/plugin-dotenv",

    // TypeScript の型検査結果をターミナルに表示する。
    "@snowpack/plugin-typescript",

    // カスタムプラグインを適用する。
    "./snowpack-plugin",
  ],

  devOptions: {
    // localhost 以外で起動したい場合は指定する。
    hostname: HOST || "localhost",

    // Create React App のデフォルトのポートと同じにする。
    port: parseInt(PORT) || 3000,

    // 自動でブラウザーを開きたくないときは open=none を指定する。
    // もしくは CLI オプションで `--open none` を渡す。
    // e.g.) $ npm start -- --open none
    open: BROWSER,
  },

  routes: [
    // Single page application として起動するため、拡張子なしのリクエストは index.html の内容を返す。
    // https://www.snowpack.dev/guides/routing#scenario-1%3A-spa-fallback-paths
    { match: "routes", src: ".*", dest: "/index.html" },
  ],

  buildOptions: {
    // Create React App のデフォルトの出力先と同じにする。
    out: BUILD_PATH || "./build/",

    // デバッグのためソースマップを有効にしておく。
    sourcemap: true,
  },
}

module.exports = config
