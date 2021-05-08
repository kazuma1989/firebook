// ビルド時に設定される環境変数をまとめる。
// 環境変数の扱いはビルドツールによって異なるため、その差異をこのモジュールで吸収する。
// .env.development, .env.production に値をセットする必要あり。

export const ENV_MODE = import.meta.env.MODE
export const ENV_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string
