import { css, cx } from "@emotion/css"
import { useEffect, useRef, useState } from "react"

type InputElementProps = JSX.IntrinsicElements["input"]

interface Props extends InputElementProps {
  customValidity?: string
}

/**
 * input 要素のラッパー。
 *
 * 既定のスタイルを持つほか、customValidity でバリデーションをカスタマイズできるようになっている。
 * customValidity に truthy な値を指定している間は、要素は :invalid な状態になる。
 */
export function Input({ customValidity, onBlur, className, ...props }: Props) {
  // 一度手をつけたかどうかのフラグを持つ。
  // 未入力の input が最初から :invalid スタイルになってしまうのを防ぐため。
  const [dirty, setDirty] = useState(false)

  // customValidity が変化するたび input 要素に値をセットする。
  const input$ = useRef<HTMLInputElement>(null)
  useEffect(() => {
    input$.current?.setCustomValidity(customValidity ?? "")
  }, [customValidity])

  return (
    <input
      ref={input$}
      onBlur={(e) => {
        onBlur?.(e)
        if (e.defaultPrevented) return

        setDirty(true)
      }}
      className={cx(
        css`
          display: block;
          padding: 14px 16px;
          font-size: 17px;
          color: var(--color-light-5);
          border: 1px solid var(--color-light-80);
          border-radius: 6px;
        `,
        dirty &&
          css`
            &:not(:focus) {
              &:valid {
                border-color: var(--color-success-40);
                box-shadow: 0 0 0 1px var(--color-success-40);
              }

              &:invalid {
                border-color: var(--color-danger-50);
                box-shadow: 0 0 0 1px var(--color-danger-50);
              }
            }
          `,
        className
      )}
      {...props}
    />
  )
}
