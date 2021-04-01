import { css, cx, keyframes } from "@emotion/css"

/**
 * 読み込み中（終了タイミング不明）の状態を表現する。
 *
 * font-size で円の直径、border-width で線の太さ、color で線の色を変更できる。
 */
export function LoadingCircle({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <progress
      className={cx(
        css`
          box-sizing: border-box;
          display: inline-block;
          width: 1em;
          height: 1em;
          background-color: transparent;
          border: 1px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;

          /* https://easings.net/#easeInOutQuart */
          animation: ${spin} 1.1s infinite cubic-bezier(0.76, 0, 0.24, 1);

          &::-moz-progress-bar {
            background-color: transparent;
          }
          &::-webkit-progress-bar {
            background-color: transparent;
          }
        `,
        className
      )}
      style={style}
    >
      Loading...
    </progress>
  )
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
