import { useState } from "react"
import { useImageDraft } from "./useImageDraft"

/**
 * 確定前の投稿（テキストと画像）を扱う。
 *
 * @param initialText 初期テキスト
 * @param initialImgSrc 初期画像
 */
export function usePostDraft(initialText: string = "", initialImgSrc?: string) {
  const [text, setText] = useState(initialText)
  const resetText = () => {
    setText(initialText)
  }

  const [img, { setImgFile, setImgUploadProgress, resetImg }] = useImageDraft(
    initialImgSrc
  )

  const dirty = text !== initialText || img?.src !== initialImgSrc
  const valid = text.trim() !== "" || Boolean(img)

  return [
    {
      text,
      img,
      dirty,
      valid,
    },
    {
      setText,
      resetText,
      resetImg,
      setImgFile,
      setImgUploadProgress,
    },
  ] as const
}
