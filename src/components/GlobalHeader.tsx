import { css, cx } from "@emotion/css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useMockAuth } from "../hooks/useMockAuth"
import { useUser } from "../hooks/useUser"
import { Avatar } from "./Avatar"
import { Button } from "./Button"
import { ButtonCircle } from "./ButtonCircle"
import { firebookLogo, menuIcon } from "./icon"
import { PopupMenu } from "./PopupMenu"

/**
 * グローバルヘッダー。
 */
export function GlobalHeader({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  // TODO モック実装を本物にする。
  const auth = useMockAuth()
  const { displayName, photoURL } = useUser()

  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => {
    setMenuVisible((v) => !v)
  }
  const closeMenu = () => {
    setMenuVisible(false)
  }

  return (
    <div
      className={cx(
        css`
          display: flex;
          align-items: center;
          height: 60px;
          padding: 0 16px 0 8px;
          background-color: var(--color-light-100);
          box-shadow: 0 -1px 6px var(--color-black-20);
        `,
        className
      )}
      style={style}
    >
      <Link
        to="/"
        className={css`
          padding: 0 8px;
          font-size: 32px;
        `}
      >
        {firebookLogo}
      </Link>

      <Button
        render={({ type, ...props }) => (
          <Link {...(props as any)} to="/profile" />
        )}
        className={css`
          display: flex;
          align-items: center;
          padding: 4px;
          margin-left: auto;
          background-color: transparent;
        `}
      >
        <span
          className={css`
            font-weight: bold;
          `}
        >
          {displayName}
        </span>

        <Avatar
          src={photoURL}
          alt={`${displayName}さんの顔写真`}
          className={css`
            width: 40px;
            height: 40px;
            margin-left: 8px;
          `}
        />
      </Button>

      <div
        className={css`
          margin-left: 4px;
        `}
      >
        <ButtonCircle
          onClick={toggleMenu}
          className={css`
            width: 40px;
            height: 40px;
            font-size: 20px;
          `}
        >
          {menuIcon}
        </ButtonCircle>

        {menuVisible && (
          <PopupMenu
            onCancel={closeMenu}
            className={css`
              position: absolute;
              z-index: 10;
              width: 280px;
              transform: translate(calc(-100% + 46px), 4px);

              &::before {
                right: 18px;
              }
            `}
          >
            <PopupMenu.Item
              render={({ type, ...props }) => (
                <Link {...(props as any)} to="/" />
              )}
              onClick={closeMenu}
            >
              ホームに戻る
            </PopupMenu.Item>

            <PopupMenu.Item
              render={({ type, ...props }) => (
                <Link {...(props as any)} to="/profile" />
              )}
              onClick={closeMenu}
            >
              自分のプロフィールを見る
            </PopupMenu.Item>

            <PopupMenu.Item
              onClick={() => {
                closeMenu()

                // TODO モック実装を本物にする。
                auth.signOut()
              }}
            >
              サインアウト
            </PopupMenu.Item>
          </PopupMenu>
        )}
      </div>
    </div>
  )
}
