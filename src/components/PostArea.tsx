import { css } from "@emotion/css"
import { useState } from "react"
import { mutate } from "swr"
import { usePostDraft } from "../hooks/usePostDraft"
import { usePosts } from "../hooks/usePosts"
import * as apiPosts from "../util/apiPosts"
import { mockProgress } from "../util/mockProgress"
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
    hasImg: boolean
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
                  hasImg: Boolean(imgSrc),
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

              await apiPosts.remove(deletingState.postId)

              await mutate(targetUID ? `/posts?author=${targetUID}` : "/posts")
            }}
          />
        </ModalBackdrop>
      )}

      {editingState && (
        <EditModal
          targetUID={targetUID}
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
  targetUID,
  postId,
  initialText = "",
  initialImgSrc,
  onCancel,
  onDiscard,
  onFinish,
}: {
  targetUID?: string
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

          // TODO モック実装を本物にする。
          await mockProgress(setImgUploadProgress)

          await apiPosts.update(postId, {
            text: draft.text,
            imgSrc: draft.img?.src ?? null,
          })

          await mutate(targetUID ? `/posts?author=${targetUID}` : "/posts")

          resetAll()
          onFinish?.()
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
