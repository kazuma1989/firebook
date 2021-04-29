import { ENV_API_ENDPOINT } from "../env"

interface UploadResult {
  downloadURL: string
}

interface ProgressListener {
  (progress: { bytesTransferred: number; totalBytes: number }): void
}

/**
 * ファイルをアップロードする。
 *
 * @example
 * const uploadTask = uploadFile(draft.img.file)
 *
 * const unsubscribe = uploadTask.onProgress(
 *   ({ bytesTransferred, totalBytes }) => {
 *     console.log((bytesTransferred / totalBytes) * 100)
 *   }
 * )
 *
 * const result = await uploadTask.send()
 *
 * unsubscribe()
 * console.log(result.downloadURL)
 */
export function uploadFile(file: File) {
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${ENV_API_ENDPOINT}/_storage`)

  return {
    /**
     * ファイルをアップロードする。
     */
    async send(): Promise<UploadResult> {
      await new Promise((resolve, reject) => {
        xhr.addEventListener("load", resolve, { once: true })

        xhr.addEventListener("abort", reject, { once: true })
        xhr.addEventListener("error", reject, { once: true })
        xhr.addEventListener("timeout", reject, { once: true })

        xhr.send(file)
      })

      const ok = 200 <= xhr.status && xhr.status <= 299
      if (!ok) {
        throw new Error(`${xhr.status} ${xhr.statusText} ${xhr.responseText}`)
      }

      return JSON.parse(xhr.responseText)
    },

    /**
     * progress イベントをリッスンする。
     *
     * @returns リッスンを停止する関数
     */
    onProgress(listener: ProgressListener): () => void {
      const progress = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
        listener({
          bytesTransferred: e.loaded,
          totalBytes: e.total,
        })
      }

      xhr.addEventListener("progress", progress)

      return () => {
        xhr.removeEventListener("progress", progress)
      }
    },
  }
}
