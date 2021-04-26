import { ENV_API_ENDPOINT } from "../env"

export interface UploadResult {
  downloadURL: string
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: {
    bytesTransferred: number
    totalBytes: number
  }) => void
): Promise<UploadResult> {
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `${ENV_API_ENDPOINT}/_storage`)

  xhr.addEventListener("progress", (e) => {
    onProgress?.({
      bytesTransferred: e.loaded,
      totalBytes: e.total,
    })
  })

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
}
