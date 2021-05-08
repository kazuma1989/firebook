// ビルド時に設定される環境変数をまとめる。
// 環境変数の扱いはビルドツールによって異なるため、その差異をこのモジュールで吸収する。
// .env.development, .env.production に値をセットする必要あり。

export const ENV_MODE = process.env.NODE_ENV
export const ENV_API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT as string
