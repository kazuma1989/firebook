import { useState } from "react"

interface DraftImg {
  src: string
  file: File | undefined
  uploadProgress: number | undefined
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

  const initialImg: DraftImg | null = initialImgSrc
    ? {
        src: initialImgSrc,
        file: undefined,
        uploadProgress: undefined,
      }
    : null

  const [img, _setImg] = useState(initialImg)
  const resetImg = () => {
    _setImg(initialImg)

    if (img?.src) {
      URL.revokeObjectURL(img.src)
    }
  }

  const setImgFile = (file: File | null) => {
    if (file) {
      _setImg({
        src: URL.createObjectURL(file),
        file,
        uploadProgress: undefined,
      })
    } else {
      _setImg(null)
    }

    if (img?.src) {
      URL.revokeObjectURL(img.src)
    }
  }

  const setImgUploadProgress = (progress: number | undefined) => {
    _setImg((img) => {
      // アップロード中でないか進捗が同じときは何もしない。
      if (!img || img.uploadProgress === progress) {
        return img
      }

      return {
        ...img,
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
