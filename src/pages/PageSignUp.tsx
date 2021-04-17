import { css } from "@emotion/css"
import { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { Button } from "../components/Button"
import { firebookLogo } from "../components/icon"
import { Input } from "../components/Input"
import { LoadingCircle } from "../components/LoadingCircle"
import { useMockAuth } from "../hooks/useMockAuth"

/**
 * あらかじめ入力可能な値。
 */
export interface StatePageSignUp {
  email?: string
  password?: string
}

/**
 * サインアップページ。
 */
export function PageSignUp() {
  // TODO モック実装を本物にする。
  const auth = useMockAuth()

  const history = useHistory()
  const navigateToHome = () => {
    history.push("/")
  }

  const [signingUp, setSigningUp] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { state } = useLocation<StatePageSignUp | undefined>()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState(state?.email ?? "")
  const [password, setPassword] = useState(state?.password ?? "")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  return (
    <div
      className={css`
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
      `}
    >
      <span
        className={css`
          margin-bottom: 16px;
          font-size: 64px;
        `}
      >
        {firebookLogo}
      </span>

      <div
        className={css`
          display: flex;
          flex-flow: column;
          width: 400px;
          max-width: calc(100% - 16px);
          background-color: var(--color-light-100);
          border-radius: 8px;
          box-shadow: 0 2px 4px var(--color-black-10),
            0 8px 16px var(--color-black-10);
        `}
      >
        <div
          className={css`
            margin: 24px 16px 6px;
            font-size: 18px;
            text-align: center;
          `}
        >
          新しいアカウントを作成
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()

            setSigningUp(true)
            setErrorMessage("")

            try {
              // TODO モック実装を本物にする。
              await auth.signUp(email, password, displayName)

              setSigningUp(false)

              navigateToHome()
            } catch (e) {
              console.error(e)

              setSigningUp(false)
              setErrorMessage("失敗しました。")
            }
          }}
          className={css`
            display: contents;
          `}
        >
          <Input
            autoFocus
            name="name"
            type="text"
            placeholder="名前"
            required
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.currentTarget.value)
            }}
            className={css`
              margin: 16px 16px 0;
            `}
          />

          <Input
            name="email"
            type="email"
            placeholder="メールアドレス"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value)
            }}
            className={css`
              margin: 12px 16px 0;
            `}
          />

          <Input
            name="password"
            type="password"
            placeholder="パスワード"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value)
            }}
            className={css`
              margin: 12px 16px 0;
            `}
          />

          <Input
            name="password-confirm"
            type="password"
            placeholder="パスワード（確認）"
            autoComplete="new-password"
            required
            customValidity={
              password === passwordConfirm
                ? ""
                : "パスワードを一致させてください"
            }
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.currentTarget.value)
            }}
            className={css`
              margin: 12px 16px 0;
            `}
          />

          {errorMessage && (
            <div
              className={css`
                margin: 12px 16px 0;
                color: var(--color-danger-40);
              `}
            >
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            disabled={signingUp}
            aria-busy={signingUp}
            className={css`
              align-self: center;
              padding: 9px 16px;
              margin: 16px 16px 20px;
              font-size: 20px;
              font-weight: bold;
              line-height: 1.5;
              border-radius: 6px;

              &:enabled,
              &:disabled {
                color: var(--color-light-100);
                background-color: var(--color-info-40);
              }
            `}
          >
            {signingUp && (
              <LoadingCircle
                className={css`
                  vertical-align: -0.1em;
                  border-width: 2px;
                `}
              />
            )}

            <span
              className={css`
                [aria-busy="true"] > & {
                  display: block;
                  height: 0;
                  visibility: hidden;
                }
              `}
            >
              アカウント登録
            </span>
          </Button>
        </form>
      </div>
    </div>
  )
}
