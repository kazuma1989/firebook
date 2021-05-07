import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

export interface Focusable {
  focus(): void
}

type TextareaElementProps = JSX.IntrinsicElements["textarea"]

/**
 * textarea 要素のラッパー。
 */
export const AutoSizingTextarea = forwardRef(function AutoSizingTextarea(
  props: TextareaElementProps,
  ref: React.ForwardedRef<Focusable>
) {
  // レンダリングのたび、テキストエリアを内容に合わせた高さに調整する。
  const textarea$ = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const textarea = textarea$.current
    if (!textarea) return

    textarea.style.height = "auto" // 一度 auto にしないと高さが縮まなくなる。
    textarea.style.height = `${textarea.scrollHeight}px`
  })

  // 内部で ref を使いつつ、外部にも ref の機能を公開する。
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          textarea$.current?.focus()
        },
      }
    },
    []
  )

  return <textarea ref={textarea$} {...props} />
})
