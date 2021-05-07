import { css, cx } from "@emotion/css"
import { useRef, useState } from "react"
import { useAuthor } from "../hooks/useAuthor"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { updatePost } from "../hooks/usePosts"
import { Avatar } from "./Avatar"
import { Button } from "./Button"
import { ButtonCircle } from "./ButtonCircle"
import { CommentArea } from "./CommentArea"
import { CommentInput, Focusable } from "./CommentInput"
import { commentIcon, likeIcon, menuIcon } from "./icon"
import { PopupMenu } from "./PopupMenu"
import { RelativeTime } from "./RelativeTime"

/**
 * 投稿一つ。
 */
export function Post({
  id: postId,
  author: authorId,
  text,
  imgSrc,
  postedAt,
  likes = [],
  totalComments = 0,
  onEdit,
  onDelete,
  className,
  style,
}: {
  id: string
  author?: string
  text?: string
  imgSrc?: string
  postedAt?: number
  likes?: string[]
  totalComments?: number
  onEdit?(): void
  onDelete?(): void
  className?: string
  style?: React.CSSProperties
}) {
  const { uid } = useCurrentUser()

  const isMine = authorId === uid
  const author = useAuthor(authorId)

  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => {
    setMenuVisible((v) => !v)
  }
  const closeMenu = () => {
    setMenuVisible(false)
  }

  const commentInput$ = useRef<Focusable>(null)

  return (
    <article
      className={cx(
        css`
          display: flex;
          flex-flow: column;
          background-color: var(--color-light-100);
          border-radius: 8px;
          box-shadow: 0 1px 2px var(--color-black-20);
        `,
        className
      )}
      style={style}
    >
      <header
        className={css`
          display: flex;
          padding: 16px 16px 0;
          margin-bottom: 8px;
        `}
      >
        <Avatar
          src={author?.photoURL}
          alt={`${author?.displayName}さんの顔写真`}
          className={css`
            width: 40px;
            height: 40px;
            margin-right: 8px;
          `}
        />

        <div>
          <span
            className={css`
              display: block;
              font-size: 15px;
              font-weight: bold;
              line-height: 1.4;
            `}
          >
            {author?.displayName}
          </span>

          <RelativeTime value={postedAt ? new Date(postedAt) : undefined} />
        </div>

        {isMine && (
          <div
            className={css`
              margin-left: auto;
            `}
          >
            <ButtonCircle
              onClick={toggleMenu}
              className={css`
                width: 36px;
                height: 36px;
                background-color: transparent;
              `}
            >
              {menuIcon}
            </ButtonCircle>

            {menuVisible && (
              <PopupMenu
                onCancel={closeMenu}
                className={css`
                  position: absolute;
                  z-index: 10;
                  width: 240px;
                  transform: translate(calc(-100% + 44px), 4px);

                  &::before {
                    right: 18px;
                  }
                `}
              >
                <PopupMenu.Item
                  onClick={() => {
                    closeMenu()

                    onEdit?.()
                  }}
                >
                  投稿を編集する
                </PopupMenu.Item>

                <PopupMenu.Item
                  onClick={() => {
                    closeMenu()

                    onDelete?.()
                  }}
                >
                  投稿を削除する
                </PopupMenu.Item>
              </PopupMenu>
            )}
          </div>
        )}
      </header>

      <p
        className={css`
          padding: 0 16px;
          margin-bottom: 8px;
          font-size: 15px;
          line-height: 1.6;
          word-wrap: break-word;
          white-space: pre-wrap;
        `}
      >
        {text}
      </p>

      {imgSrc && (
        <div
          className={css`
            margin-bottom: 8px;
            border: solid 0 var(--color-light-90);
            border-width: 1px 0;
          `}
        >
          <img
            alt="投稿に添付された写真"
            src={imgSrc}
            className={css`
              display: block;
              max-width: 100%;
              margin: 0 auto;
            `}
          />
        </div>
      )}

      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          margin-bottom: 8px;
          font-size: 15px;
          color: var(--color-light-40);
        `}
      >
        <div>
          <span
            className={css`
              margin-right: 4px;
              color: var(--color-primary-50);
            `}
          >
            {likeIcon}
          </span>

          <span>{likes.length}</span>
        </div>

        <div>コメント{totalComments}件</div>
      </div>

      <div
        className={css`
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          margin: 0 16px;
          border-top: solid 1px var(--color-light-80);
          border-bottom: solid 1px var(--color-light-80);
        `}
      >
        <Button
          onClick={async () => {
            try {
              await updatePost(postId, {
                // いいねしていたらいいねを取り消し、していなかったらいいね追加。
                likes: likes?.includes(uid)
                  ? likes.filter((v) => v !== uid)
                  : [...likes, uid],
              })
            } catch (error: unknown) {
              console.error(error)

              alert("いいねできませんでした。")
            }
          }}
          className={cx(
            css`
              width: calc(50% - 2px);
              padding: 4px 8px;
              background-color: transparent;
            `,
            likes.includes(uid) &&
              css`
                font-weight: bold;
                color: var(--color-primary-40);
              `
          )}
        >
          <span
            className={css`
              margin-right: 4px;
            `}
          >
            {likeIcon}
          </span>

          <span>いいね！</span>
        </Button>

        <Button
          onClick={() => {
            commentInput$.current?.focus()
          }}
          className={css`
            width: calc(50% - 2px);
            padding: 4px 8px;
            background-color: transparent;
          `}
        >
          <span
            className={css`
              margin-right: 4px;
            `}
          >
            {commentIcon}
          </span>

          <span>コメント</span>
        </Button>
      </div>

      <CommentArea
        postId={postId}
        totalComments={totalComments}
        className={css`
          margin: 8px 16px 0;
        `}
      />

      <CommentInput
        ref={commentInput$}
        postId={postId}
        className={css`
          margin: 0 16px 8px;
        `}
      />
    </article>
  )
}
