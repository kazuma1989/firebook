import { css, cx } from "@emotion/css"

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLElement>

interface Props extends ButtonElementProps {
  render?(props: ButtonElementProps): JSX.Element
}

/**
 * button 要素のラッパー。
 *
 * 既定のスタイルを持つほか、type="button" がデフォルトになっている。
 * Submit ボタンとして使いたいときは type="submit" が明示的に必要。
 *
 * render prop を使い、button 要素以外の要素としてレンダリングすることもできる。
 */
export function Button({
  type = "button",
  render,
  className,
  ...props
}: Props) {
  const buttonStyle = cx(
    css`
      color: var(--color-light-10);
      text-align: center;
      cursor: pointer;
      background-color: var(--color-light-90);
      border-radius: 6px;
      outline-offset: initial;

      &:hover {
        background-image: linear-gradient(
          var(--color-black-5),
          var(--color-black-5)
        );
      }

      &:active {
        background-image: linear-gradient(
          var(--color-black-10),
          var(--color-black-10)
        );
      }

      &[aria-disabled="true"],
      &:disabled {
        color: var(--color-light-70);
        cursor: not-allowed;
        background-color: var(--color-light-90);

        &:hover {
          background-image: initial;
        }
      }
    `,
    className
  )

  if (!render) {
    return <button type={type} className={buttonStyle} {...props} />
  }

  // render prop があるときは render の返すとおりの要素としてレンダリングする。
  const { onKeyDown, onKeyUp, ...restOfProps } = props

  return render({
    // button 要素以外にボタンの役割を持たせたことをブラウザーに伝えるため、role 属性に button を指定する。
    role: "button",

    // tabIndex を指定してタブキーでフォーカスできるようにする。
    tabIndex: 0,

    // Space キーでクリックを模倣して、button 要素と挙動を近づける。
    // https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#keyboard_and_focus
    onKeyDown(e) {
      onKeyDown?.(e)
      if (e.defaultPrevented) return

      if (e.nativeEvent.isComposing) return
      if (e.key === " ") {
        // 画面がスクロールしてしまうのを防ぐ。
        e.preventDefault()
      }
    },
    onKeyUp(e) {
      onKeyUp?.(e)
      if (e.defaultPrevented) return

      if (e.nativeEvent.isComposing) return
      if (e.key === " ") {
        if (e.target instanceof HTMLElement) {
          e.target.click()
        }
      }
    },

    className: buttonStyle,

    ...restOfProps,
  })
}

/**
 * ボタンのスタイルを持った span 要素としてレンダリングする。
 * 中にインタラクティブな要素（a, button, input など）を置くときに使う。
 */
export function asNonInteractiveSpan({
  type,
  role,
  tabIndex,
  disabled,
  onKeyDown,
  onKeyUp,
  ...props
}: ButtonElementProps) {
  return <span aria-disabled={disabled} {...props} />
}
