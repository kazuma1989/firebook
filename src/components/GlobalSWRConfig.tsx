import { SWRConfig } from "swr"
import { ENV_API_ENDPOINT } from "../env"

/**
 * SWR の共通設定。
 */
export function GlobalSWRConfig({ children }: { children?: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        dedupingInterval: 60_000,
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
