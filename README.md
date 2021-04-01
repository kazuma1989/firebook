# Firebook

> ✨ Bootstrapped with Create Snowpack App (CSA).

```console
npx create-snowpack-app my-app --template @kazuma1989/firebook
```

## これは何

Firebook という架空の SNS サイトを実装しながら学習するためのスターターテンプレートです。

次のパッケージをあらかじめセットアップしてあります。

- Emotion
- React (+ React Router)
- ESLint
- Prettier
- Snowpack
- TypeScript

IDE は Visual Studio Code が推奨です。必要な拡張機能をすぐインストールできるようにしてあります。

## 利用可能なスクリプト

### `npm start [-- --open none]`

アプリを開発モードで起動します。ブラウザーが起動して http://localhost:8000 が表示されます。
ブラウザーを起動したくないときは `-- --open none` オプションを渡してください。

ソースコードを編集するとページがリロードします。
TypeScript による型検査のエラーはコンソールに表示されます。

### `npm run build`

アプリを静的資材として `build/` ディレクトリにコピーします。
そのディレクトリをデプロイすれば OK です！

### `npm test`

初期状態ではテストがないので、エラー終了します。

### `npm run format`

ソースコードを整形します。

### `npm run lint`

ソースコードを静的検査します。

## UI を実装済みのソースコードまで進めるには

UI の実装をスキップして学習を進めたいときは、次のコマンドを実行してください。
**ローカルの編集内容を上書きするので注意してください。**

```console
npx @kazuma1989/firebook update
npm install
```
