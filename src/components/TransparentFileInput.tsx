import { css, cx } from "@emotion/css"

/**
 * input[type="file"] 要素のラッパー。
 *
 * input[type="file"] はデザインをカスタマイズできないので、透明にして機能性だけ利用する。
 */
export function TransparentFileInput({
  onChange,
  className,
  ...props
}: Omit<JSX.IntrinsicElements["input"], "type">) {
  return (
    <input
      type="file"
      onChange={(e) => {
        onChange?.(e)

        // value を空にすることで、同じファイルを連続で選択できる。
        e.currentTarget.value = ""
      }}
      className={cx(
        css`
          color: transparent;
          text-indent: -1000px;
        `,
        className
      )}
      {...props}
    />
  )
}
