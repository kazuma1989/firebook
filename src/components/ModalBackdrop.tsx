import { css, cx } from "@emotion/css"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { createFocusTrap } from "focus-trap"
import { useEffect, useRef } from "react"

/**
 * ほかの要素の手前に表示してモーダルを表現する。
 *
 * マウントの切り替えで表示・非表示を切り替えてもよいし、hidden prop で切り替えてもよい。
 * hidden で切り替えると DOM の実体が残り続けるので、テキスト選択状態など細かい点も残せる。
 */
export function ModalBackdrop({
  initialFocus,
  hidden,
  onCancel,
  className,
  ...props
}: {
  initialFocus?: string
  hidden?: boolean
  onCancel?(): void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  // タブキーによるフォーカス移動をモーダル内に「捕まえる」。
  const backdrop$ = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!backdrop$.current) return
    if (hidden) return

    const element = initialFocus
      ? backdrop$.current.querySelector(initialFocus)
      : null

    const trap = createFocusTrap(backdrop$.current, {
      initialFocus: element instanceof HTMLElement ? element : undefined,
      escapeDeactivates: false,
    })

    trap.activate()

    return () => {
      trap.deactivate()
    }
  }, [hidden, initialFocus])

  // モーダル外のスクロールを抑制する。
  useEffect(() => {
    if (hidden) return

    disableBodyScroll(document.body)

    return () => {
      enableBodyScroll(document.body)
    }
  }, [hidden])

  return (
    <div
      ref={backdrop$}
      // keyDown イベントを受け取れるように tabIndex を指定しつつ、タブキーでフォーカスが当たらないように -1 を設定する。
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.nativeEvent.isComposing) return

        if (e.key === "Escape") {
          onCancel?.()
        }
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return

        onCancel?.()
      }}
      className={cx(
        css`
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-white-80);
        `,
        hidden &&
          css`
            visibility: hidden;
          `,
        className
      )}
      {...props}
    />
  )
}
