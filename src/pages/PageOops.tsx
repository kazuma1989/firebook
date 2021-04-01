import { css } from "@emotion/css"
import { firebookLogo } from "../components/icon"
import { ENV_MODE } from "../env"

/**
 * エラーのときに表示する汎用の画面。
 *
 * details は開発時のみ表示する。
 */
export function PageOops({ details }: { details?: string }) {
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

      <h1>Oops!</h1>

      {ENV_MODE === "development" && (
        <p
          className={css`
            margin-top: 8px;
          `}
        >
          {details}
        </p>
      )}
    </div>
  )
}
