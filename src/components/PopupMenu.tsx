import { css, cx } from "@emotion/css"
import { useEffect, useRef } from "react"
import { tabbable } from "tabbable"
import { Button } from "./Button"

/**
 * ポップアップメニューの吹き出し。
 *
 * 吹き出しの「しっぽ」の部分は、`&::before` 擬似要素のスタイルで位置調整する。
 */
export function PopupMenu({
  onCancel,
  className,
  ...props
}: {
  onCancel?(): void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  // メニューを開いたらフォーカスを自動で移す。
  const popup$ = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!popup$.current) return

    let prevFocus: HTMLElement | null = null

    const [element] = tabbable(popup$.current)
    if (element) {
      // フォーカスを移す前にフォーカスの当たっていた要素を記憶する。
      // その要素が body の場合は、フォーカスが当たっていないも同然なので、無視する。
      if (
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        prevFocus = document.activeElement
      }

      element.focus()
    }

    return () => {
      // フォーカスを外の要素に移してメニューを閉じた場合は activeElement が body 以外になる。
      // その場合フォーカスを戻さない。
      if (document.activeElement !== document.body) return

      prevFocus?.focus()
    }
  }, [])

  return (
    <div
      ref={popup$}
      // keyDown イベントを受け取れるように tabIndex を指定しつつ、タブキーでフォーカスが当たらないように -1 を設定する。
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.nativeEvent.isComposing) return

        switch (e.key) {
          // メニューを閉じる。
          case "Escape": {
            e.preventDefault()

            onCancel?.()

            break
          }

          // 選択項目を移す。
          case "ArrowUp":
          case "ArrowDown": {
            e.preventDefault()

            const down = e.key === "ArrowDown"

            const elements = tabbable(e.currentTarget)

            let index =
              document.activeElement instanceof HTMLElement
                ? elements.indexOf(document.activeElement) + (down ? 1 : -1)
                : 0
            // 末尾を超えたらループして先頭を選ぶ。
            if (index > elements.length - 1) {
              index = 0
            }
            // 先頭を超えたらループして末尾を選ぶ。
            else if (index < 0) {
              index = elements.length - 1
            }

            elements[index]?.focus()

            break
          }
        }
      }}
      onBlur={(e) => {
        // この要素の外にフォーカスが移ったときだけイベントを発火する。
        // cf. https://stackoverflow.com/a/60094794/8662861
        const currentFocus = e.relatedTarget
        if (
          currentFocus instanceof Node &&
          e.currentTarget.contains(currentFocus)
        )
          return

        onCancel?.()
      }}
      className={cx(
        css`
          display: flex;
          flex-flow: column;
          align-items: center;
          padding: 8px;
          background-color: var(--color-light-100);
          border-radius: 8px;
          box-shadow: 0 12px 28px 0 var(--color-black-20),
            0 2px 4px 0 var(--color-black-10),
            inset 0 0 0 1px var(--color-white-50);

          /* 吹き出しの「しっぽ」の部分 */
          &::before {
            position: absolute;
            top: -16px;
            display: block;
            content: "";
            border: solid 8px transparent;
            border-bottom-color: var(--color-light-100);
          }
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ポップアップメニューの一項目。
 */
PopupMenu.Item = function Item({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cx(
        css`
          display: block;
          width: 100%;
          padding: 6px 8px;
          font-size: 15px;
          text-align: unset;
          background-color: transparent;
          border-radius: 4px;
        `,
        className
      )}
      {...props}
    />
  )
}
