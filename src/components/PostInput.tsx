import { css, cx } from "@emotion/css"
import { useState } from "react"
import { usePostDraft } from "../hooks/usePostDraft"
import { addPost } from "../hooks/usePosts"
import { useUser } from "../hooks/useUser"
import { mockProgress } from "../util/mockProgress"
import { Avatar } from "./Avatar"
import { DialogPostEdit } from "./DialogPostEdit"
import { ModalBackdrop } from "./ModalBackdrop"

/**
 * 新しい投稿を入力するエリア。
 * クリックするとダイアログが開く。
 */
export function PostInput({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const { uid, displayName, photoURL } = useUser()

  const [
    draft,
    { setText, resetText, resetImg, setImgFile, setImgUploadProgress },
  ] = usePostDraft()

  const [submitting, setSubmitting] = useState(false)

  const resetAll = () => {
    resetText()
    resetImg()
    setSubmitting(false)
  }

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
          submitting={submitting}
          onTextChange={setText}
          onImgChange={setImgFile}
          onClose={closeDialog}
          onSubmit={async () => {
            setSubmitting(true)

            // TODO モック実装を本物にする。
            await mockProgress(setImgUploadProgress)

            await addPost({
              author: uid,
              text: draft.text,
              imgSrc: draft.img?.src ?? null,
              postedAt: Date.now(),
              likes: [],
              totalComments: 0,
            })

            closeDialog()
            resetAll()
          }}
        />
      </ModalBackdrop>
    </div>
  )
}
