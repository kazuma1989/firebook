# Mock API

## これは何

Firebook という架空の SNS サイトを実装しながら学習する際に使う、モックの REST API サーバーです。

[JSON Server](https://github.com/typicode/json-server) を拡張し、画像のストレージ機能を持たせています。

## 利用可能なスクリプト

### `npm start`

サーバーを起動します。
URL は http://localhost:5000 です。

次のリソース別エンドポイントが使えます。

- `/insecureAuthInfo`
- `/users`
- `/posts`
- `/comments`

たとえば `GET /posts` で `posts` の一覧が、`GET /posts/post_1` で ID `post_1` の `posts` リソースが取得できます。
POST, PUT, PATCH, DELETE メソッドもそれぞれ使えます。

また、次のエンドポイントで画像のアップロードやダウンロードができます。

- `/_storage`

たとえば、アップロードするときは `POST /_storage` に画像バイナリデータを送信してください。
ダウンロードは、POST のレスポンスに含まれる `downloadURL` の値を使って `GET /_storage/1619766773554.png` などとすれば可能です。
