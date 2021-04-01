import { css, cx } from "@emotion/css"

/**
 * ページ全体のレイアウトを決めるコンテナ要素。
 */
export function GlobalLayout({
  className,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div
      className={cx(
        css`
          display: grid;
          grid-template:
            "header" 60px
            "body" 1fr
            "footer" 60px
            / 1fr;
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ヘッダー領域。
 * スクロールしても画面上部に固定。
 */
GlobalLayout.Header = function Header({
  className,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <header
      className={cx(
        css`
          position: fixed;
          z-index: 10;
          grid-area: header;
          width: 100%;
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ボディ領域。
 */
GlobalLayout.Body = function Body({
  className,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div
      className={cx(
        css`
          grid-area: body;
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * フッター領域。
 */
GlobalLayout.Footer = function Footer({
  className,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <footer
      className={cx(
        css`
          grid-area: footer;
        `,
        className
      )}
      {...props}
    />
  )
}
