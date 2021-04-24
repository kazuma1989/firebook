import { css, cx } from "@emotion/css"
import { forwardRef, useState } from "react"
import { mutate } from "swr"
import { useUser } from "../hooks/useUser"
import * as apiComments from "../util/apiComments"
import { AutoSizingTextarea } from "./AutoSizingTextarea"
import { Avatar } from "./Avatar"
import { ButtonCircle } from "./ButtonCircle"
import { sendIcon } from "./icon"

/**
 * 投稿へのコメントを入力する欄。
 */
export const CommentInput = forwardRef(function CommentInput(
  {
    postId,
    className,
    style,
  }: {
    postId?: string
    className?: string
    style?: React.CSSProperties
  },
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const { uid, displayName, photoURL } = useUser()

  const [text, setText] = useState("")
  const valid = text.trim() !== ""

  const submit = async () => {
    setText("")

    await apiComments.add({
      postId,
      author: uid,
      text,
      postedAt: Date.now(),
    })

    await mutate(`/comments?postId=${postId}`)
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!valid) return

        await submit()
      }}
      className={cx(
        css`
          position: relative;
          display: flex;
          align-items: flex-start;
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
          width: 32px;
          height: 32px;
          margin-top: 2px;
          margin-right: 6px;
        `}
      />

      <AutoSizingTextarea
        ref={ref}
        placeholder="コメントする"
        rows={1}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value)
        }}
        onKeyDown={async (e) => {
          if (e.nativeEvent.isComposing) return
          if (!valid) return

          // Command/Control + Enter 入力で送信
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            await submit()
          }
        }}
        className={css`
          width: 100%;
          padding: 6.5px 12px;
          padding-right: 36px;
          font-size: 15px;
          line-height: calc(23 / 15);
          resize: none;
          background-color: var(--color-light-95);
          border-radius: 18px;
        `}
      />

      <ButtonCircle
        type="submit"
        disabled={!valid}
        className={css`
          width: 36px;
          height: 36px;
          margin-left: -36px;
          font-size: 16px;
          color: var(--color-primary-50);

          && {
            background-color: transparent;
          }
        `}
      >
        {sendIcon}
      </ButtonCircle>
    </form>
  )
})
