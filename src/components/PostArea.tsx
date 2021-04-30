import { css } from "@emotion/css"
import { useState } from "react"
import { usePostDraft } from "../hooks/usePostDraft"
import { removePost, updatePost, usePosts } from "../hooks/usePosts"
import { removeFile } from "../util/removeFile"
import { uploadFile } from "../util/uploadFile"
import { Dialog } from "./Dialog"
import { DialogPostEdit } from "./DialogPostEdit"
import { ModalBackdrop } from "./ModalBackdrop"
import { Post } from "./Post"

/**
 * 投稿を表示するエリア。
 */
export function PostArea({
  targetUID,
  className,
  style,
}: {
  targetUID?: string
  className?: string
  style?: React.CSSProperties
}) {
  const posts = usePosts(targetUID, 15)

  const [deletingState, setDeletingState] = useState<{
    postId: string
    imgSrc?: string
  } | null>(null)
  const stopDeleting = () => {
    setDeletingState(null)
  }

  const [editingState, setEditingState] = useState<{
    postId: string
    initialText?: string
    initialImgSrc?: string
  } | null>(null)
  const clearEditingState = () => {
    setEditingState(null)
  }

  return (
    <div className={className} style={style}>
      {posts.map(
        ({
          id: postId,
          author,
          text,
          imgSrc,
          postedAt,
          likes,
          totalComments,
        }) => {
          return (
            <Post
              key={postId}
              id={postId}
              author={author}
              text={text}
              imgSrc={imgSrc}
              postedAt={postedAt}
              likes={likes}
              totalComments={totalComments}
              onEdit={() => {
                setEditingState({
                  postId,
                  initialText: text,
                  initialImgSrc: imgSrc,
                })
              }}
              onDelete={() => {
                setDeletingState({
                  postId,
                  imgSrc,
                })
              }}
              className={css`
                margin-bottom: 16px;
              `}
            />
          )
        }
      )}

      {deletingState && (
        <ModalBackdrop
          initialFocus="[data-button-cancel]"
          onCancel={stopDeleting}
        >
          <DeleteConfirmationDialog
            onCancel={stopDeleting}
            onSubmit={async () => {
              stopDeleting()

              if (deletingState.imgSrc) {
                await removeFile(deletingState.imgSrc)
              }

              await removePost(deletingState.postId)
            }}
          />
        </ModalBackdrop>
      )}

      {editingState && (
        <EditModal
          postId={editingState.postId}
          initialText={editingState.initialText}
          initialImgSrc={editingState.initialImgSrc}
          onCancel={clearEditingState}
          onDiscard={clearEditingState}
          onFinish={clearEditingState}
        />
      )}
    </div>
  )
}

/**
 * 投稿を削除していいか確認するダイアログ。
 */
function DeleteConfirmationDialog({
  onCancel,
  onSubmit,
}: {
  onCancel?(): void
  onSubmit?(): void
}) {
  return (
    <Dialog onSubmit={onSubmit}>
      <Dialog.Header onClose={onCancel}>投稿を削除しますか？</Dialog.Header>

      <Dialog.Body>この投稿を削除してよろしいですか？</Dialog.Body>

      <Dialog.Footer>
        <Dialog.ButtonCancel
          data-button-cancel
          onClick={onCancel}
          className={css`
            margin-right: 8px;
          `}
        >
          キャンセル
        </Dialog.ButtonCancel>

        <Dialog.ButtonSubmit>削除</Dialog.ButtonSubmit>
      </Dialog.Footer>
    </Dialog>
  )
}

/**
 * 投稿を編集するダイアログとバックドロップ。
 *
 * PostArea は子コンポーネントが多いため、入力中の文字のように頻繁に変わるステートを持たせると UI がカクついてしまう。
 * ダイアログだけ切り出して、文字入力でも UI がカクつかないように対策する。
 */
function EditModal({
  postId,
  initialText = "",
  initialImgSrc,
  onCancel,
  onDiscard,
  onFinish,
}: {
  postId: string
  initialText?: string
  initialImgSrc?: string
  onCancel?(): void
  onDiscard?(): void
  onFinish?(): void
}) {
  const [
    draft,
    { setText, resetText, resetImg, setImgFile, setImgUploadProgress },
  ] = usePostDraft(initialText, initialImgSrc)

  const [submitting, setSubmitting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const stopConfirming = () => {
    setConfirming(false)
  }

  const resetAll = () => {
    resetText()
    resetImg()
    setSubmitting(false)
    setConfirming(false)
  }

  return (
    <ModalBackdrop
      initialFocus="[data-textarea-main]"
      onCancel={() => {
        if (draft.dirty) {
          return
        }

        resetAll()
        onCancel?.()
      }}
    >
      <DialogPostEdit
        headerChildren="投稿を編集"
        submitButtonChildren="保存"
        text={draft.text}
        imgSrc={draft.img?.src}
        uploadProgress={draft.img?.uploadProgress}
        submitting={submitting}
        onTextChange={setText}
        onImgChange={setImgFile}
        onClose={() => {
          if (draft.dirty) {
            setConfirming(true)
            return
          }

          resetAll()
          onCancel?.()
        }}
        onSubmit={async () => {
          setSubmitting(true)

          try {
            // 編集開始時と終了時を比べて、画像をどう変更したか分類する。
            let imageUpdate:
              | {
                  type: "unchanged"
                }
              | {
                  type: "added"
                  file: File
                }
              | {
                  type: "changed"
                  file: File
                  prevImgSrc: string
                }
              | {
                  type: "removed"
                  removedImgSrc: string
                }

            if (initialImgSrc) {
              // 元から画像があったうえで改めてファイルを選んだときは「変更」。
              if (draft.img?.file) {
                imageUpdate = {
                  type: "changed",
                  file: draft.img.file,
                  prevImgSrc: initialImgSrc,
                }
              }
              // 元の画像と現状の画像 URL が同じときは「変更なし」。
              else if (draft.img?.src === initialImgSrc) {
                imageUpdate = {
                  type: "unchanged",
                }
              }
              // 元の画像があったのに前述のどちらでもない場合は「削除」。
              else {
                imageUpdate = {
                  type: "removed",
                  removedImgSrc: initialImgSrc,
                }
              }
            } else {
              // 元は画像がなかったが今はファイルを選んでいるときは「追加」。
              if (draft.img?.file) {
                imageUpdate = {
                  type: "added",
                  file: draft.img.file,
                }
              }
              // 元から画像がなくて今回もファイルがないので「変更なし」。
              else {
                imageUpdate = {
                  type: "unchanged",
                }
              }
            }

            switch (imageUpdate.type) {
              // 画像を追加または変更したときは画像をアップロードする。
              case "added":
              case "changed": {
                const uploadTask = uploadFile(imageUpdate.file)

                const unsubscribe = uploadTask.onProgress(
                  ({ bytesTransferred, totalBytes }) => {
                    setImgUploadProgress((bytesTransferred / totalBytes) * 100)
                  }
                )

                const result = await uploadTask.send()

                unsubscribe()
                const downloadURL = result.downloadURL

                if (imageUpdate.type === "changed") {
                  await removeFile(imageUpdate.prevImgSrc)
                }

                await updatePost(postId, {
                  text: draft.text,
                  imgSrc: downloadURL,
                })

                break
              }

              // 画像を削除する。
              case "removed": {
                await updatePost(postId, {
                  text: draft.text,
                  imgSrc: null,
                })

                await removeFile(imageUpdate.removedImgSrc)

                break
              }

              // 画像を変えていないときは Storage に対しては何もしない。
              case "unchanged": {
                await updatePost(postId, {
                  text: draft.text,
                })

                break
              }
            }

            resetAll()
            onFinish?.()
          } catch (error: unknown) {
            console.error(error)

            setImgUploadProgress(undefined)
            setSubmitting(false)

            alert("投稿できませんでした。")
          }
        }}
      />

      {confirming && (
        <ModalBackdrop
          initialFocus="[data-button-cancel]"
          onCancel={stopConfirming}
        >
          <DiscardConfirmationDialog
            onCancel={stopConfirming}
            onSubmit={() => {
              resetAll()
              onDiscard?.()
            }}
          />
        </ModalBackdrop>
      )}
    </ModalBackdrop>
  )
}

/**
 * 編集中の内容を破棄していいか確認するダイアログ。
 */
function DiscardConfirmationDialog({
  onCancel,
  onSubmit,
}: {
  onCancel?(): void
  onSubmit?(): void
}) {
  return (
    <Dialog onSubmit={onSubmit}>
      <Dialog.Header onClose={onCancel}>
        変更内容が保存されていません
      </Dialog.Header>

      <Dialog.Body>変更内容を破棄してよろしいですか？</Dialog.Body>

      <Dialog.Footer>
        <Dialog.ButtonCancel
          data-button-cancel
          onClick={onCancel}
          className={css`
            margin-right: 8px;
          `}
        >
          編集を続ける
        </Dialog.ButtonCancel>

        <Dialog.ButtonSubmit>破棄</Dialog.ButtonSubmit>
      </Dialog.Footer>
    </Dialog>
  )
}
