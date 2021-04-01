import { css } from "@emotion/css"
import { PostArea } from "../components/PostArea"
import { PostInput } from "../components/PostInput"

/**
 * メインのホームページ。
 */
export function PageHome() {
  return (
    <div
      className={css`
        min-width: 320px;
        max-width: 680px;
        margin: 16px auto;
      `}
    >
      <PostInput
        className={css`
          margin: 16px 0;
        `}
      />

      <PostArea />
    </div>
  )
}
