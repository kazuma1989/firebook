import { css, cx } from "@emotion/css"
import { useState } from "react"
import { useAuthor } from "../hooks/useAuthor"
import { useUser } from "../hooks/useUser"
import { Avatar } from "./Avatar"
import { ButtonCircle } from "./ButtonCircle"
import { menuIcon } from "./icon"
import { PopupMenu } from "./PopupMenu"
import { RelativeTime } from "./RelativeTime"

/**
 * 投稿へのコメント。
 */
export function Comment({
  author: authorId,
  text,
  postedAt,
  onDelete,
  className,
  style,
}: {
  author?: string
  text?: string
  postedAt?: number
  onDelete?(): void
  className?: string
  style?: React.CSSProperties
}) {
  const { uid } = useUser()

  const isMine = authorId === uid
  const author = useAuthor(authorId)

  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => {
    setMenuVisible((v) => !v)
  }
  const closeMenu = () => {
    setMenuVisible(false)
  }

  return (
    <article
      className={cx(
        css`
          display: flex;
        `,
        className
      )}
      style={style}
    >
      <Avatar
        src={author?.photoURL}
        alt={`${author?.displayName}さんの顔写真`}
        className={css`
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          margin-top: 2px;
          margin-right: 6px;
        `}
      />

      <div>
        <div
          className={css`
            display: flex;
          `}
        >
          <p
            className={css`
              padding: 8px 12px;
              background-color: var(--color-light-95);
              border-radius: 18px;
            `}
          >
            <span
              className={css`
                display: block;
                font-size: 13px;
                font-weight: bold;
              `}
            >
              {author?.displayName}
            </span>

            <span
              className={css`
                font-size: 15px;
                line-height: 1.4;
                word-wrap: break-word;
                white-space: pre-wrap;
              `}
            >
              {text}
            </span>
          </p>

          {isMine && (
            <div
              className={css`
                flex-shrink: 0;
                align-self: center;
              `}
            >
              <ButtonCircle
                onClick={toggleMenu}
                className={css`
                  width: 32px;
                  height: 32px;
                  margin-left: 6px;
                  font-size: 16px;
                  color: var(--color-light-40);
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
                    transform: translate(calc(-50% + 22px), 4px);
                  `}
                >
                  <PopupMenu.Item
                    onClick={() => {
                      closeMenu()

                      onDelete?.()
                    }}
                  >
                    コメントを削除する
                  </PopupMenu.Item>
                </PopupMenu>
              )}
            </div>
          )}
        </div>

        <RelativeTime
          value={postedAt ? new Date(postedAt) : undefined}
          className={css`
            margin-left: 12px;
          `}
        />
      </div>
    </article>
  )
}
