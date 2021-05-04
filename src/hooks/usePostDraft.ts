import { useEffect, useState } from "react"

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
  useEffect(() => {
    return () => {
      if (img?.src) {
        URL.revokeObjectURL(img.src)
      }
    }
  }, [img?.src])

  const resetImg = () => {
    _setImg(initialImg)
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
