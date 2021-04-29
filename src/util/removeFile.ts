import { ENV_API_ENDPOINT } from "../env"

/**
 * ファイルを削除する。
 */
export async function removeFile(imgSrc: string): Promise<void> {
  if (!imgSrc.startsWith(ENV_API_ENDPOINT)) return

  const resp = await fetch(imgSrc, {
    method: "DELETE",
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }
}
