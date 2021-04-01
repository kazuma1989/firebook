import { css, cx } from "@emotion/css"
import { Button as BaseButton } from "./Button"
import { ButtonCircle } from "./ButtonCircle"
import { closeIcon } from "./icon"

/**
 * ダイアログ。
 */
export function Dialog({
  onSubmit,
  className,
  ...props
}: {
  onSubmit?(): void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()

        onSubmit?.()
      }}
      className={cx(
        css`
          display: grid;
          grid-template:
            "header" 60px
            "body" 1fr
            "footer" auto
            / 1fr;
          width: 500px;
          max-width: 100%;
          height: auto;
          max-height: calc(100% - 16px * 2);
          background-color: var(--color-light-100);
          border-radius: 6px;
          box-shadow: 0 12px 28px 0 var(--color-black-20),
            0 2px 4px 0 var(--color-black-10),
            inset 0 0 0 1px var(--color-white-50);
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ヘッダー領域。
 */
Dialog.Header = function Header({
  disabled,
  onClose,
  className,
  children,
  ...props
}: {
  disabled?: boolean
  onClose?(): void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <header
      className={cx(
        css`
          position: relative;
          display: flex;
          grid-area: header;
          align-items: center;
          justify-content: flex-start;
          padding: 0 16px;
          font-size: 20px;
          font-weight: bold;
          border-bottom: 1px solid var(--color-black-10);
        `,
        className
      )}
      {...props}
    >
      {children}

      <ButtonCircle
        disabled={disabled}
        onClick={onClose}
        className={css`
          position: absolute;
          right: 16px;
          width: 36px;
          height: 36px;
          font-size: 20px;
        `}
      >
        {closeIcon}
      </ButtonCircle>
    </header>
  )
}

/**
 * ボディ領域。
 */
Dialog.Body = function Body({
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
          padding: 16px;
          overflow: auto;
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
Dialog.Footer = function Footer({
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
          display: flex;
          grid-area: footer;
          justify-content: flex-end;
          padding: 0 16px 16px;
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ダイアログに配置する汎用のボタン。
 *
 * 基本的には ButtonSubmit または ButtonCancel を使えばいいが、スタイルをカスタマイズしたい場合はプレーンなこちらを使うのが便利。
 */
Dialog.Button = function Button({
  className,
  ...props
}: React.ComponentProps<typeof BaseButton>) {
  return (
    <BaseButton
      className={cx(
        css`
          min-width: 100px;
          padding: 8px 12px;
          font-size: 15px;
          line-height: 1.3;
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ダイアログに配置するサブミットボタン。
 */
Dialog.ButtonSubmit = function ButtonSubmit({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Button>) {
  return (
    <Dialog.Button
      type="submit"
      className={cx(
        css`
          font-weight: bold;
          color: var(--color-light-100);
          background-color: var(--color-primary-40);
        `,
        className
      )}
      {...props}
    />
  )
}

/**
 * ダイアログに配置するキャンセルボタン。
 */
Dialog.ButtonCancel = function ButtonCancel({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Button>) {
  return (
    <Dialog.Button
      className={cx(
        css`
          font-weight: bold;
          color: var(--color-primary-40);
          background-color: transparent;
        `,
        className
      )}
      {...props}
    />
  )
}
