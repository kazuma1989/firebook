/**
 * 進捗度 (0-100) の変化をモックする。
 */
export function mockProgress(onNext?: (progress: number) => void) {
  return new Promise<void>((resolve) => {
    let progress = 0
    onNext?.(progress)

    const interval = setInterval(() => {
      progress += 25

      if (progress <= 100) {
        onNext?.(progress)
        return
      }

      resolve()
      clearInterval(interval)
    }, 200)
  })
}
