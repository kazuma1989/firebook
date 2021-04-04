/// <reference lib="es2018" />

const path = require("path")

/**
 * public/index.html に src/index.tsx（のトランスフォーム後の index.js）を読み込む script 要素を挿入する。
 *
 * @type {import("snowpack").SnowpackPluginFactory}
 */
const plugin = function (snowpackConfig, pluginOptions) {
  const indexHtmlSuffix = path.normalize("/public/index.html")

  return {
    name: "inject-index-js",

    async transform({ id, contents }) {
      if (!id.endsWith(indexHtmlSuffix)) return

      const { mount } = snowpackConfig
      const { url: distPath = "" } = mount[path.resolve(__dirname, "src")] || {}

      return contents.toString().replace(
        "</head>",
        // react-jsx 形式の JSX 変換が扱えないビルドツールで擬似的に react-jsx 形式を実現するためのハック。
        // 擬似的というのは、import React をしないでいいというソースコード観点しか満たせず、JSX 変換後の動作効率の点は満たせないということ。
        String.raw`
<script type="module">
  import React from "react"
  globalThis.React = React
</script>
<script type="module" src="${distPath}/index.js"></script>
</head>
`
      )
    },
  }
}

module.exports = plugin
