import { useEffect, useState } from "react"
import stubAuth from "../stub/auth.json"

const STORAGE_KEY = "firebook.authenticated"

const EVENT_TYPE = "firebook.useMockAuth"

/**
 * サインイン状態をモックするための、session storage のラッパー。
 * カスタムイベントを発行して変更を検知できるようになっている。
 */
const storage = {
  get() {
    return sessionStorage.getItem(STORAGE_KEY)
  },

  set(value: string) {
    sessionStorage.setItem(STORAGE_KEY, value)

    window.dispatchEvent(new Event(EVENT_TYPE))
  },

  remove() {
    sessionStorage.removeItem(STORAGE_KEY)

    window.dispatchEvent(new Event(EVENT_TYPE))
  },

  subscribe(listener: () => void) {
    window.addEventListener(EVENT_TYPE, listener)

    return () => {
      window.removeEventListener(EVENT_TYPE, listener)
    }
  },
}

/**
 * サインイン機能をモックする。
 * Session storage にサインイン状態を記録するので、ブラウザーを開いている間は持続する。
 *
 * カスタムイベントによって session storage の変更を検知している。
 */
export function useMockAuth() {
  const [authenticated, setAuthenticated] = useState(Boolean(storage.get()))

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setAuthenticated(Boolean(storage.get()))
    })

    return unsubscribe
  }, [])

  return {
    authenticated,

    async signUp(email: string, password: string, displayName: string) {
      console.log({ email, password, displayName })

      await wait(1_000)

      if (
        email === stubAuth.email &&
        password === stubAuth.insecurePlainPassword
      ) {
        storage.set("yes")
      } else {
        throw new Error("サインアップに失敗しました。")
      }
    },

    async signIn(email: string, password: string) {
      console.log({ email, password })

      await wait(1_000)

      if (
        email === stubAuth.email &&
        password === stubAuth.insecurePlainPassword
      ) {
        storage.set("yes")
      } else {
        throw new Error("サインインに失敗しました。")
      }
    },

    async signOut() {
      storage.remove()
    },
  }
}

function wait(millisecond: number) {
  return new Promise((resolve) => setTimeout(resolve, millisecond))
}
