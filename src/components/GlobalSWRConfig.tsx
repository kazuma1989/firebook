import { SWRConfig } from "swr"
import { ENV_API_ENDPOINT } from "../env"

/**
 * SWR の共通設定。
 */
export function GlobalSWRConfig({ children }: { children?: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // エラー発生時もリトライはしない。
        shouldRetryOnError: false,

        // ブラウザータブにフォーカスを戻したときに再度リクエストを送らない。
        revalidateOnFocus: false,

        // 60 秒の間はリクエストせずキャッシュを使う。
        dedupingInterval: 60_000,

        // ネイティブの Fetch API を使いながら、200 番台でないレスポンスをエラー扱いにする。
        // API エンドポイントも環境変数で設定する。
        fetcher: async (url: string) => {
          const resp = await fetch(`${ENV_API_ENDPOINT}${url}`)
          if (resp.ok) {
            return await resp.json()
          }

          throw new Error(
            `${resp.status} ${resp.statusText} ${await resp.text()}`
          )
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
