import { css } from "@emotion/css"
import { useState } from "react"
import stubUsers from "../stub/users.json"
import { Comment } from "./Comment"
import { Dialog } from "./Dialog"
import { ModalBackdrop } from "./ModalBackdrop"

/**
 * 投稿へのコメント一覧を表示する領域。
 */
export function CommentArea({
  postPath,
  totalComments = 0,
  className,
  style,
}: {
  postPath?: string
  totalComments?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [limit, setLimit] = useState(3)
  // TODO モック実装を本物にする。
  const [author, postId] = postPath?.split("/") ?? []
  const post = stubUsers
    .find((u) => u.uid === author)
    ?.posts.find((p) => p.id === postId)
  const comments = post?.comments.slice(-limit) ?? []

  const [deletingCommentId, setDeletingCommentId] = useState("")
  const finishConfirmingDeleteComment = () => {
    setDeletingCommentId("")
  }

  return (
    <div className={className} style={style}>
      {comments.length < totalComments && (
        <button
          type="button"
          onClick={() => {
            setLimit((v) => v + 3)
          }}
          className={css`
            width: 100%;
            margin-bottom: 4px;
            font-size: 15px;
            font-weight: bold;
            color: var(--color-light-40);
            text-align: start;

            &:hover {
              text-decoration: underline;
            }
          `}
        >
          他のコメントを見る
        </button>
      )}

      {comments.map(({ id: commentId, author, text, postedAt }) => {
        return (
          <Comment
            key={commentId}
            author={author}
            text={text}
            postedAt={postedAt}
            onDelete={() => {
              setDeletingCommentId(commentId)
            }}
            className={css`
              margin-bottom: 4px;
            `}
          />
        )
      })}

      {deletingCommentId && (
        <ModalBackdrop
          initialFocus="[data-button-cancel]"
          onCancel={finishConfirmingDeleteComment}
        >
          <DeleteConfirmationDialog
            onCancel={finishConfirmingDeleteComment}
            onSubmit={async () => {
              finishConfirmingDeleteComment()

              // TODO モック実装を本物にする。
            }}
          />
        </ModalBackdrop>
      )}
    </div>
  )
}

/**
 * コメントを削除していいか確認するダイアログ。
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
      <Dialog.Header onClose={onCancel}>コメントを削除しますか？</Dialog.Header>

      <Dialog.Body>このコメントを削除してよろしいですか？</Dialog.Body>

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
