/**
 * react-jsx 形式の JSX 変換が扱えないビルドツールで擬似的に react-jsx 形式を実現するためのモジュール。
 * 擬似的というのは、import React をしないでいいというソースコード観点しか満たせず、JSX 変換後の動作効率の点は満たせないということ。
 *
 * ほかのあらゆる JSX より先に読み込む必要がある。
 */

import React from "react"

globalThis.React = React
