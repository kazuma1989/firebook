import { css, cx } from "@emotion/css"
import { useRef } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { AutoSizingTextarea } from "./AutoSizingTextarea"
import { asNonInteractiveSpan } from "./Button"
import { ButtonCircle } from "./ButtonCircle"
import { Dialog } from "./Dialog"
import { closeIcon } from "./icon"
import { LoadingCircle } from "./LoadingCircle"
import { TransparentFileInput } from "./TransparentFileInput"

/**
 * 投稿を編集するダイアログ。
 *
 * 投稿内容を入力するテキストエリアは `data-textarea-main` 属性を持つ。
 */
export function DialogPostEdit({
  text = "",
  imgSrc,
  uploadProgress,
  submitting,
  onTextChange,
  onImgChange,
  onClose,
  onSubmit,
  className,
  style,
  headerChildren,
  submitButtonChildren,
}: {
  text?: string
  imgSrc?: string
  uploadProgress?: number
  submitting?: boolean
  onTextChange?(text: string): void
  onImgChange?(file: File | null): void
  onClose?(): void
  onSubmit?(): void
  className?: string
  style?: React.CSSProperties
  headerChildren?: React.ReactNode
  submitButtonChildren?: React.ReactNode
}) {
  const { displayName } = useCurrentUser()

  const valid = text.trim() !== "" || Boolean(imgSrc)

  const textarea$ = useRef<HTMLTextAreaElement>(null)

  return (
    <Dialog onSubmit={onSubmit} className={className} style={style}>
      <Dialog.Header
        disabled={submitting}
        onClose={onClose}
        className={css`
          justify-content: center;
        `}
      >
        {headerChildren}
      </Dialog.Header>

      <Dialog.Body
        className={css`
          position: relative;
        `}
      >
        <AutoSizingTextarea
          data-textarea-main
          ref={textarea$}
          disabled={submitting}
          value={text}
          placeholder={`${displayName}さん、その気持ち、シェアしよう`}
          onChange={(e) => {
            onTextChange?.(e.currentTarget.value)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return
            if (!valid) return

            // Command/Control + Enter 入力で送信
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              onSubmit?.()
            }
          }}
          className={cx(
            css`
              width: 100%;
              resize: none;
              outline-offset: 8px;
            `,
            imgSrc
              ? css`
                  font-size: 15px;
                `
              : css`
                  min-height: 240px;
                  font-size: 24px;
                `
          )}
        />

        {imgSrc && (
          <div
            className={css`
              position: relative;
              margin: 16px 0 0;
              overflow: hidden;
              border: solid 1px var(--color-light-80);
              border-radius: 8px;
            `}
          >
            <img
              alt="投稿に添付する写真"
              src={imgSrc}
              className={css`
                display: block;
                max-width: 100%;
                margin: auto;
              `}
            />

            <ButtonCircle
              disabled={submitting}
              onClick={() => {
                onImgChange?.(null)

                textarea$.current?.focus()
              }}
              className={css`
                position: absolute;
                top: 8px;
                right: 8px;
                width: 28px;
                height: 28px;
                font-size: 16px;
              `}
            >
              {closeIcon}
            </ButtonCircle>

            {uploadProgress !== undefined && (
              <progress
                max={100}
                value={uploadProgress}
                className={css`
                  position: absolute;
                  bottom: 0;
                  display: block;
                  width: calc(100% - 8px);
                  margin: 0 4px;
                `}
              />
            )}
          </div>
        )}

        {submitting && (
          <div
            className={css`
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--color-white-50);
            `}
          >
            <LoadingCircle
              className={css`
                width: 48px;
                height: 48px;
                color: var(--color-primary-50);
                border-width: 2px;
              `}
            />
          </div>
        )}
      </Dialog.Body>

      <Dialog.Footer
        className={css`
          display: flex;
          flex-flow: column;
        `}
      >
        <Dialog.Button
          render={asNonInteractiveSpan}
          disabled={Boolean(imgSrc) || submitting}
          className={css`
            position: relative;
            margin-bottom: 16px;
            font-weight: bold;
          `}
        >
          <span>画像を追加</span>

          <TransparentFileInput
            accept="image/*"
            disabled={Boolean(imgSrc) || submitting}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              if (!file) return

              onImgChange?.(file)

              textarea$.current?.focus()
            }}
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            `}
          />
        </Dialog.Button>

        <Dialog.ButtonSubmit disabled={!valid || submitting}>
          {submitButtonChildren}
        </Dialog.ButtonSubmit>
      </Dialog.Footer>
    </Dialog>
  )
}
