import { useEffect, useState } from "react"
import { InsecureAuthInfo, User } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

/**
 * サインイン機能をモックする。
 * Session storage にサインイン状態を記録するので、ブラウザーを開いている間は持続する。
 *
 * カスタムイベントによって session storage の変更を検知している。
 */
export function useMockAuth() {
  const [currentUser, setCurrentUser] = useState(getCurrentUserFromStorage())

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUser(getCurrentUserFromStorage())
    })

    return unsubscribe
  }, [])

  return {
    /**
     * サインイン中のユーザーの情報。
     */
    currentUser,

    /**
     * サインイン（ログイン）する。
     *
     * モック API のレスポンスがあればサインイン成功とするだけの簡易な仕組み。
     * 実際に認証するわけではない。
     */
    async signIn(email: string, password: string) {
      const search = new URLSearchParams({
        email,
        insecurePlainPassword: password,
      })

      const [authInfo]: InsecureAuthInfo[] = await fetch(
        `${ENV_API_ENDPOINT}/insecureAuthInfo?${search.toString()}`
      ).then((r) => r.json())

      if (!authInfo) {
        throw new Error("サインインに失敗しました。")
      }

      setCurrentUserToStorage(authInfo)
    },

    /**
     * サインアウト（ログアウト）する。
     */
    async signOut() {
      storage.remove()
    },

    /**
     * サインアップ（ユーザー登録）する。
     *
     * モックデータベースに users レコードを作成し、その ID に対応した認証レコードを作成する簡易な仕組み。
     * 実際に認証するわけではない。
     */
    async signUp(email: string, password: string, displayName: string) {
      const { id: uid }: User = await fetch(`${ENV_API_ENDPOINT}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
        }),
      }).then((r) => r.json())

      const resp = await fetch(`${ENV_API_ENDPOINT}/insecureAuthInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          insecurePlainPassword: password,
          uid,
        }),
      })

      if (!resp.ok) {
        throw new Error("サインアップに失敗しました。")
      }

      const authInfo: InsecureAuthInfo = await resp.json()
      setCurrentUserToStorage(authInfo)
    },
  }
}

/**
 * サインイン中のユーザーの情報。
 */
interface CurrentUser {
  uid: string
}

function getCurrentUserFromStorage(): CurrentUser | null {
  return JSON.parse(storage.get() ?? "null")
}

function setCurrentUserToStorage(user: CurrentUser): void {
  storage.set(JSON.stringify(user))
}

/**
 * サインイン状態をモックするための、session storage のラッパー。
 * カスタムイベントを発行して変更を検知できるようになっている。
 */
const storage = {
  get(): string | null {
    return sessionStorage.getItem(STORAGE_KEY)
  },

  set(value: string): void {
    sessionStorage.setItem(STORAGE_KEY, value)

    window.dispatchEvent(new Event(EVENT_TYPE))
  },

  remove(): void {
    sessionStorage.removeItem(STORAGE_KEY)

    window.dispatchEvent(new Event(EVENT_TYPE))
  },

  subscribe(listener: () => void): () => void {
    window.addEventListener(EVENT_TYPE, listener)

    return () => {
      window.removeEventListener(EVENT_TYPE, listener)
    }
  },
}

const STORAGE_KEY = "firebook.authenticated"

const EVENT_TYPE = "firebook.useMockAuth"
