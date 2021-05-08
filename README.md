# Firebook

```console
npx hina kazuma1989/firebook#start
```

## これは何

Firebook という架空の SNS サイトを実装しながら学習するためのスターターテンプレートです。

次のパッケージをあらかじめセットアップしてあります。

- Emotion
- React
- ESLint
- Prettier
- TypeScript
- Vite

IDE は Visual Studio Code が推奨です。必要な拡張機能をすぐインストールできるようにしてあります。

## 利用可能なスクリプト

### `npm start [-- --no-open]`

アプリを開発モードで起動します。ブラウザーが起動して http://localhost:3000 が表示されます。
ブラウザーを起動したくないときは `-- --no-open` オプションを渡してください。
もしくは環境変数 `BROWSER` を `none` に設定してください。(e.g. `BROWSER=none npm start`)

ソースコードを編集するとページがリロードします。
TypeScript による型検査のエラーはコンソールに表示されます。

### `npm run build`

アプリを静的資材として `build/` ディレクトリにコピーします。
そのディレクトリをデプロイすれば OK です！

### `npm run format`

ソースコードを整形します。

### `npm run lint`

ソースコードを静的検査します。
