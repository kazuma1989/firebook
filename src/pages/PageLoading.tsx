import { css } from "@emotion/css"
import { LoadingCircle } from "../components/LoadingCircle"

/**
 * 読み込み中のページ。
 */
export function PageLoading() {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 90vh;
      `}
    >
      <LoadingCircle
        className={css`
          width: 64px;
          height: 64px;
          color: var(--color-primary-50);
          border-width: 2px;
        `}
      />
    </div>
  )
}
