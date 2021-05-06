import { css } from "@emotion/css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/Button"
import { firebookLogo } from "../components/icon"
import { Input } from "../components/Input"
import { LoadingCircle } from "../components/LoadingCircle"
import { signIn } from "../hooks/useUserState"
import { StatePageSignUp } from "./PageSignUp"

/**
 * サインインページ。
 */
export function PageSignIn() {
  const [signingIn, setSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
          Firebookにサインイン
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()

            setSigningIn(true)
            setErrorMessage("")

            try {
              await signIn(email, password)

              setSigningIn(false)
            } catch (error: unknown) {
              console.error(error)

              setSigningIn(false)
              setErrorMessage(
                "メールアドレスまたはパスワードが間違っています。"
              )
            }
          }}
          className={css`
            display: contents;
          `}
        >
          <Input
            autoFocus
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
              margin: 16px 16px 0;
            `}
          />

          <Input
            name="password"
            type="password"
            placeholder="パスワード"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value)
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
            disabled={signingIn}
            aria-busy={signingIn}
            className={css`
              padding: 9px 16px;
              margin: 12px 16px;
              font-size: 20px;
              font-weight: bold;
              line-height: 1.5;
              border-radius: 6px;

              &:enabled,
              &:disabled {
                color: var(--color-light-100);
                background-color: var(--color-primary-50);
              }
            `}
          >
            {signingIn && (
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
              サインイン
            </span>
          </Button>
        </form>

        <div
          className={css`
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--color-light-40);

            &::before,
            &::after {
              flex-grow: 1;
              margin: 0 16px;
              content: "";
              border-bottom: solid 1px var(--color-light-80);
            }
          `}
        >
          または
        </div>

        <Button
          render={({ type, ...props }) => (
            <Link<StatePageSignUp>
              {...(props as any)}
              to={{
                pathname: "/sign-up",
                state: {
                  email,
                  password,
                },
              }}
            />
          )}
          className={css`
            align-self: center;
            padding: 11.5px 16px;
            margin: 16px 16px 20px;
            font-size: 17px;
            font-weight: bold;
            line-height: 1.5;
            color: var(--color-light-100);
            background-color: var(--color-info-40);
            border-radius: 6px;
          `}
        >
          新しいアカウントを作成
        </Button>
      </div>
    </div>
  )
}
