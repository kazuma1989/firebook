import { css, cx } from "@emotion/css"
import { useState } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { usePostDraft } from "../hooks/usePostDraft"
import { addPost } from "../hooks/usePosts"
import { uploadFile } from "../util/uploadFile"
import { Avatar } from "./Avatar"
import { DialogPostEdit } from "./DialogPostEdit"
import { ModalBackdrop } from "./ModalBackdrop"

/**
 * 新しい投稿を入力するエリア。
 */
export function PostInput({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const { uid, displayName, photoURL } = useCurrentUser()

  const [draft, { setText, setImgFile, setImgUploadProgress }] = usePostDraft()

  const [submitting, setSubmitting] = useState(false)

  const [dialogVisible, setDialogVisible] = useState(false)
  const openDialog = () => {
    setDialogVisible(true)
  }
  const closeDialog = () => {
    setDialogVisible(false)
  }

  return (
    <div
      className={cx(
        css`
          display: flex;
          padding: 16px;
          background-color: var(--color-light-100);
          border-radius: 8px;
          box-shadow: 0 1px 2px var(--color-black-20);
        `,
        className
      )}
      style={style}
    >
      <Avatar
        src={photoURL}
        alt={`${displayName}さんの顔写真`}
        className={css`
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          margin-right: 8px;
        `}
      />

      <input
        // テキストはダイアログから入力するので、ここは単なるボタン。
        type="button"
        value={draft.text || `${displayName}さん、その気持ち、シェアしよう`}
        onClick={openDialog}
        className={cx(
          css`
            width: 100%;
            padding: 0 16px;
            overflow: hidden;
            font-size: 17px;
            text-align: unset;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            background-color: var(--color-light-95);
            border-radius: 20px;

            &:hover {
              background-image: linear-gradient(
                var(--color-black-5),
                var(--color-black-5)
              );
            }
          `,
          !draft.text &&
            css`
              color: var(--color-light-40);
            `
        )}
      />

      <ModalBackdrop
        initialFocus="[data-textarea-main]"
        hidden={!dialogVisible}
        onCancel={closeDialog}
      >
        <DialogPostEdit
          headerChildren="投稿を作成"
          submitButtonChildren="投稿"
          text={draft.text}
          imgSrc={draft.img?.src}
          uploadProgress={draft.img?.uploadProgress}
          invalid={!draft.valid}
          submitting={submitting}
          onTextChange={setText}
          onImgChange={setImgFile}
          onClose={closeDialog}
          onSubmit={async () => {
            setSubmitting(true)

            try {
              let downloadURL: string | null = null
              if (draft.img?.file) {
                const uploadTask = uploadFile(draft.img.file)

                setImgUploadProgress(0)
                const unsubscribe = uploadTask.onProgress(
                  ({ bytesTransferred, totalBytes }) => {
                    setImgUploadProgress((bytesTransferred / totalBytes) * 100)
                  }
                )

                const result = await uploadTask.send()

                unsubscribe()
                downloadURL = result.downloadURL
              }

              await addPost({
                author: uid,
                text: draft.text,
                imgSrc: downloadURL,
                postedAt: Date.now(),
                likes: [],
                totalComments: 0,
              })

              setText("")
              setImgFile(null)
              setSubmitting(false)

              closeDialog()
            } catch (error: unknown) {
              console.error(error)

              setImgUploadProgress(undefined)
              setSubmitting(false)

              alert("投稿できませんでした。")
            }
          }}
        />
      </ModalBackdrop>
    </div>
  )
}
