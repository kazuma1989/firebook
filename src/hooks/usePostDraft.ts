import { useState } from "react"

interface DraftImg {
  src: string
  file?: File
  uploadProgress?: number
}

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

  const [img, _setImg] = useState<DraftImg | null>(
    initialImgSrc ? { src: initialImgSrc } : null
  )

  const resetImg = () => {
    _setImg(initialImgSrc ? { src: initialImgSrc } : null)

    if (img?.src) {
      URL.revokeObjectURL(img.src)
    }
  }

  const setImgFile = (file: File | null) => {
    if (file) {
      _setImg({
        src: URL.createObjectURL(file),
        file,
      })
    } else {
      _setImg(null)
    }

    if (img?.src) {
      URL.revokeObjectURL(img.src)
    }
  }

  const setImgUploadProgress = (progress: number) => {
    _setImg((image) => {
      if (!image || image.uploadProgress === progress) {
        return image
      }

      return {
        ...image,
        uploadProgress: progress,
      }
    })
  }

  const dirty = text !== initialText || img?.src !== initialImgSrc

  return [
    {
      text,
      img,
      dirty,
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
