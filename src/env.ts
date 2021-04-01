/**
 * ビルド時に設定される環境変数をまとめる。
 *
 * 環境変数の扱いはビルドツールによって異なるため、その差異をこのモジュールで吸収する。
 */

/**
 * Snowpack は import.meta.env として環境変数を提供してくれる。
 */
declare global {
  interface ImportMeta {
    env: {
      // Snowpack が自動で設定してくれる。
      MODE: "development" | "production"

      // .env.development, .env.production に値をセットする必要あり。
      // @snowpack/plugin-dotenv が拾って値を設定してくれる。
      SNOWPACK_PUBLIC_TEST_VALUE: string
    }
  }
}

const {
  MODE: ENV_MODE,
  SNOWPACK_PUBLIC_TEST_VALUE: ENV_TEST_VALUE,
} = import.meta.env

export { ENV_MODE, ENV_TEST_VALUE }
