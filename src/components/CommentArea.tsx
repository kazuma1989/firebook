import { css } from "@emotion/css"
import { useState } from "react"
import { ENV_API_ENDPOINT } from "../env"
import { useComments } from "../hooks/useComments"
import { Comment } from "./Comment"
import { Dialog } from "./Dialog"
import { ModalBackdrop } from "./ModalBackdrop"

/**
 * 投稿へのコメント一覧を表示する領域。
 */
export function CommentArea({
  postId,
  totalComments = 0,
  className,
  style,
}: {
  postId?: string
  totalComments?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [page, setPage] = useState(1)
  const nextPage = () => {
    setPage((v) => v + 1)
  }

  // 投稿時刻降順で取得したものの順序を反転することで、
  // 最新のコメントを取得しつつ新しいものを下に表示するということが可能
  const [_comments, revalidate] = useComments(postId, page)
  const comments = [..._comments].reverse()

  const [deletingCommentId, setDeletingCommentId] = useState("")
  const finishConfirmingDeleteComment = () => {
    setDeletingCommentId("")
  }

  return (
    <div className={className} style={style}>
      {comments.length < totalComments && (
        <button
          type="button"
          onClick={nextPage}
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

              // TODO ENV_API_ENDPOINT はラッパー使ってなくしてもいいかも。
              await fetch(`${ENV_API_ENDPOINT}/comments/${deletingCommentId}`, {
                method: "DELETE",
              })

              revalidate()
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
