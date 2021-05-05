import { useEffect, useState } from "react"

interface DraftImg {
  src: string
  file: File | undefined
  uploadProgress: number | undefined
}

export function useImageDraft(initialImgSrc?: string) {
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

  const resetImg = () => {
    _setImg(initialImg)
  }

  return [
    img,
    {
      setImgFile,
      setImgUploadProgress,
      resetImg,
    },
  ] as const
}
