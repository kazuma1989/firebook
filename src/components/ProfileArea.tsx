import { css, cx } from "@emotion/css"
import { useState } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { updateUser } from "../hooks/useUser"
import { removeFile } from "../util/removeFile"
import { uploadFile } from "../util/uploadFile"
import { Avatar } from "./Avatar"
import { asNonInteractiveSpan } from "./Button"
import { ButtonCircle } from "./ButtonCircle"
import { Dialog } from "./Dialog"
import { cameraIcon } from "./icon"
import { ModalBackdrop } from "./ModalBackdrop"
import { TransparentFileInput } from "./TransparentFileInput"

/**
 * プロフィール画像と背景画像を表示するエリア。
 */
export function ProfileArea({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const { uid, displayName, photoURL } = useCurrentUser()

  const [img, _setImg] = useState<{
    src: string
    file: File
    uploadProgress: number | undefined
  } | null>(null)

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

  const clearImg = () => {
    setImgFile(null)
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

  return (
    <div
      className={cx(
        css`
          display: flex;
          flex-flow: column;
          align-items: center;
          background-color: var(--color-light-100);
          box-shadow: 0 1px 2px var(--color-black-10);
        `,
        className
      )}
      style={style}
    >
      <div
        className={css`
          width: 100%;
          max-width: 940px;
          overflow: hidden;
          background-color: var(--color-light-95);
          background-image: url("https://source.unsplash.com/940x350/daily");
          background-position: center;
          border-radius: 0 0 8px 8px;

          @media (max-width: 940px) {
            border-radius: 0;
          }
        `}
      >
        <div
          className={css`
            padding-top: 37%;
            background-image: linear-gradient(
              transparent 75%,
              var(--color-black-40)
            );
          `}
        />
      </div>

      <div
        className={css`
          position: relative;
        `}
      >
        <Avatar
          src={photoURL}
          alt={`${displayName}さんの顔写真`}
          className={css`
            width: 176px;
            height: 176px;
            margin-top: -160px;
            border: solid 4px var(--color-light-100);
            border-radius: 50%;
          `}
        />

        <ButtonCircle
          render={asNonInteractiveSpan}
          className={css`
            position: absolute;
            right: 12px;
            bottom: 12px;
            width: 36px;
            height: 36px;
          `}
        >
          {cameraIcon}

          <TransparentFileInput
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              if (!file) return

              setImgFile(file)
            }}
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            `}
          />
        </ButtonCircle>

        {img && (
          <ModalBackdrop
            initialFocus="[data-button-cancel]"
            onCancel={clearImg}
          >
            <ProfileImageDialog
              src={img.src}
              alt={`${displayName}さんの顔写真`}
              uploadProgress={img.uploadProgress}
              disabled={img.uploadProgress !== undefined}
              onCancel={clearImg}
              onSubmit={async () => {
                try {
                  const uploadTask = uploadFile(img.file)

                  setImgUploadProgress(0)
                  const unsubscribe = uploadTask.onProgress(
                    ({ bytesTransferred, totalBytes }) => {
                      setImgUploadProgress(
                        (bytesTransferred / totalBytes) * 100
                      )
                    }
                  )

                  const result = await uploadTask.send()

                  unsubscribe()
                  const downloadURL = result.downloadURL

                  await updateUser(uid, {
                    photoURL: downloadURL,
                  })

                  if (photoURL) {
                    await removeFile(photoURL)
                  }

                  clearImg()
                } catch (error: unknown) {
                  console.error(error)

                  setImgUploadProgress(undefined)

                  alert("プロフィールを変更できませんでした。")
                }
              }}
            />
          </ModalBackdrop>
        )}
      </div>

      <div
        className={css`
          margin: 8px 0 32px;
          font-size: 32px;
          font-weight: bold;
          line-height: 1.2;
        `}
      >
        {displayName}
      </div>
    </div>
  )
}

/**
 * プロフィール画像を選んだときのダイアログ。
 */
function ProfileImageDialog({
  src,
  alt,
  uploadProgress,
  disabled,
  onCancel,
  onSubmit,
}: {
  src?: string
  alt?: string
  uploadProgress?: number
  disabled?: boolean
  onCancel?(): void
  onSubmit?(): void
}) {
  return (
    <Dialog onSubmit={onSubmit}>
      <Dialog.Header
        disabled={disabled}
        onClose={onCancel}
        className={css`
          justify-content: center;
        `}
      >
        プロフィール写真を変更
      </Dialog.Header>

      <Dialog.Body
        className={css`
          display: flex;
          flex-flow: column;
          align-items: center;
        `}
      >
        <Avatar
          src={src}
          alt={alt}
          className={css`
            width: 300px;
            height: 300px;
          `}
        />

        {uploadProgress !== undefined && (
          <progress
            max={100}
            value={uploadProgress}
            className={css`
              display: block;
              width: 100%;
            `}
          />
        )}
      </Dialog.Body>

      <Dialog.Footer>
        <Dialog.ButtonCancel
          data-button-cancel
          disabled={disabled}
          onClick={onCancel}
          className={css`
            margin-right: 8px;
          `}
        >
          キャンセル
        </Dialog.ButtonCancel>

        <Dialog.ButtonSubmit disabled={disabled}>保存</Dialog.ButtonSubmit>
      </Dialog.Footer>
    </Dialog>
  )
}
