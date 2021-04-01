import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

/**
 * textarea 要素のラッパー。
 */
export const AutoSizingTextarea = forwardRef(function AutoSizingTextarea(
  props: JSX.IntrinsicElements["textarea"],
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  // レンダリングのたび、テキストエリアを内容に合わせた高さに調整する。
  const textarea$ = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const textarea = textarea$.current
    if (!textarea) return

    textarea.style.height = "auto" // 一度 auto にしないと高さが縮まなくなる。
    textarea.style.height = `${textarea.scrollHeight}px`
  })

  // 内部で ref を使いつつ、外部にも ref を公開する。
  useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
    ref,
    () => textarea$.current,
    []
  )

  return <textarea ref={textarea$} {...props} />
})
