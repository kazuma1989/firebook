import { css } from "@emotion/css"
import { firebookLogo } from "../components/icon"

/**
 * 予期せぬ URL のとき表示するページ。
 */
export function PageNotFound() {
  return (
    <div
      className={css`
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
      `}
    >
      <span
        className={css`
          margin-bottom: 16px;
          font-size: 64px;
        `}
      >
        {firebookLogo}
      </span>

      <h1>404 Not Found</h1>
    </div>
  )
}
